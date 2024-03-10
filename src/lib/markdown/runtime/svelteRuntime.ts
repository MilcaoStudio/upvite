import type { ComponentType } from "svelte";

const hasOwnProperty = Object.prototype.hasOwnProperty;
let __DEV__ = true;
const enableRefAsProp = false;

export type SvelteNode = string | boolean | number | SvelteElement | null | undefined;
export type SvelteElement = {
    _store: { validated: boolean },
    type: string | ComponentType,
    props: Record<string, any> | null,
    children?: SvelteNode[],
};

let CurrentOwner: {
    current: {
        stateNode: SvelteNode,
        type: string | null,
    }
} = {
    current: {
        stateNode: null,
        type: null,
    }
};

type Props = {
    [x: string]: any,
    ref?: HTMLElement,
    children?: SvelteNode[],
}

function printWarning(level: "debug" | "error" | "log" | "warn", format: string, args: any[]) {
    let stack = "";
    if (stack != "") {
        format += "%s";
        args = args.concat([stack]);
    }
    const argsWithFormat = args.map(item => String(item));
    argsWithFormat.unshift('Warning: ' + format);
    console[level].apply(console, argsWithFormat);
}

function error(format: string, ...args: string[]) {
    const _len2 = arguments.length;
    args = new Array(_len2 > 1 ? _len2 - 1 : 0);
    for (let _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2]
    }

    printWarning('error', format, args);
}

function hasValidRef(config: Props) {
    {
        if (hasOwnProperty.call(config, 'ref')) {
            const getter: { isWarning: boolean } | undefined = Object.getOwnPropertyDescriptor(config, 'ref')?.get as any;
            if (getter && getter.isWarning) {
                return false
            }
        }
    }
    return config.ref != undefined
}

function isValidElementType(type: string | Function) {
    return typeof type == "string" || typeof type == "function"
}

export function svelteDevWithDynamicChildren(type: string | Function,
    config: Props,
) {
    if (__DEV__) {
        const isStaticChildren = false;
        return svelteDEV(type, config, isStaticChildren);
    }
}

export function svelteDevWithStaticChildren(
    type: string | Function,
    config: Props,
) {
    if (__DEV__) {
        const isStaticChildren = true;
        return svelteDEV(type, config, isStaticChildren);
    }
}

function SvelteElement(type: string | Function, _ref: HTMLElement | undefined, _owner: any, props: Record<string, any>) {
    let ref: HTMLElement | undefined;
    if (enableRefAsProp) {
        const refProp = props.ref;
        ref = refProp != undefined ? (refProp as HTMLElement) : undefined;
    } else {
        ref = _ref;
    }

    let element: { [x: string]: any } = {
        type,
        ref,
        props,
        owner: _owner,
    }

    if (__DEV__) {
        element._store = {};
        Object.defineProperty(element._store, 'validated', {
            configurable: false,
            enumerable: false,
            writable: true,
            value: false,
        });
        Object.defineProperty(element, '_debugInfo', {
            configurable: false,
            enumerable: false,
            writable: true,
            value: null,
        });
        if (Object.freeze) {
            Object.freeze(element.props);
            Object.freeze(element);
        }
    }
    return element as SvelteElement
}

export function svelteProd(type: string | Function, config: Props) {
    let propName: keyof Props;
    const props: Record<string, any> = {};
    let ref;
    if (hasValidRef(config)) {
        if (!enableRefAsProp) {
            ref = config.ref;
        }
    }

    for (propName in config) {
        if (
            hasOwnProperty.call(config, propName) &&
            (enableRefAsProp || propName != 'ref')
        ) {
            props[propName] = config[propName];
        }
    }
    return SvelteElement(type, ref, CurrentOwner.current, props);
}

export function svelteDEV(type: string | Function, config: Props, isStaticChildren: boolean) {
    if (__DEV__) {
        if (!isValidElementType(type)) {
            let info = '';
            if (!type || (typeof type == 'object' && type != null && !Object.keys(type).length)) {
                info += ' You likely forgot to export your component from the file ' +
                    "it's defined in, or you might have mixed up default and named imports.";
            }
            let typeString;
            if (!type) {
                typeString = 'null';
            } else if (Array.isArray(type)) {
                typeString = 'array';
            } else {
                typeString = typeof type;
            }
            error('Svelte: type is invalid -- expected a string (for ' +
                'built-in components) or a class/function (for composite ' +
                'components) but got: %s.%s', typeString, info,);
        } else {
            const children = config.children;
            if (children) {
                if (isStaticChildren) {
                    if (Array.isArray(children)) {
                        for (let i = 0; i < children.length; i++) {
                            validateChildKeys(children[i]);
                        }

                        if (Object.freeze) {
                            Object.freeze(children);
                        }
                    } else {
                        console.error(
                            'Svelte: Static children should always be an array. '
                        );
                    }
                } else {
                    validateChildKeys(children);
                }
            }
        }

        let propName: keyof Props;
        // Reserved names are extracted
        const props: Record<string, any> = {};
        let ref;

        if (hasValidRef(config)) {
            if (!enableRefAsProp) {
                ref = config.ref;
            }
        }

        // Remaining properties are added to a new props object
        for (propName in config) {
            if (hasOwnProperty.call(config, propName) &&
                (enableRefAsProp || propName != 'ref')
            ) {
                props[propName] = config[propName];
            }
        }

        const element = SvelteElement(
            type,
            ref,
            self,
            props,
        );

        return element
    }
}

function validateChildKeys(node: SvelteNode | SvelteNode[]) {
    if (__DEV__) {
        if (typeof node != "object" || !node) {
            return;
        }
        if (Array.isArray(node)) {
            for (const child of node) {
                if (isValidElement(child)) {
                    validateKey(child);
                }
            }
        } else if (isValidElement(node)) {
            if (node._store) {
                node._store.validated = true;
            }
        }
    }
}

function isValidElement(object: any): object is SvelteElement {
    return typeof object == "object" && object != null
}

function validateKey(element: SvelteElement) {
    if (!element._store || element._store.validated) {
        return;
    }
    element._store.validated = true;
}

function getComponentNameFromType(type: any): string | null {
    if (typeof type == "string") {
        return type
    }
    if (typeof type == "function") {
        return type.name
    }
    return null
}

export function createElement(type: string | ComponentType, config: Props | null, ...children: SvelteNode[]) {
    if (__DEV__) {
        if (!isValidElementType(type)) {
            let info = '';
            if (type === undefined ||
                (typeof type == "object" && type != null && !Object.keys(type).length)
            ) {
                info += ' You likely forgot to export your component from the file ' +
                    "it's defined in, or you might have mixed up default and named imports.";
            }

            let typeString: string;
            if (type === null) {
                typeString = 'null';
            } else if (Array.isArray(type)) {
                typeString = 'array';
            } else if (type != undefined) {
                typeString = `<${getComponentNameFromType(type) || 'Unknown'} />`;
                info =
                    ' Did you accidentally export a JSX literal instead of a component?';
            } else {
                typeString = typeof type;
            }

            console.error(
                'svelte.createElement: type is invalid -- expected a string (for ' +
                'built-in components) or a class/function (for composite ' +
                'components) but got: %s.%s',
                typeString,
                info,
            );
        } else {
            for (const child of children) {
                validateChildKeys(child);
            }
        }
    }

    let propName: string
    const props: Record<string, any> = {};
    let ref;
    if (config != null) {
        if (hasValidRef(config)) {
            if (!enableRefAsProp) {
                ref = config.ref;
            }
        }

        // Remaining properties are added to a new props object
        for (propName in config) {
            if (
                hasOwnProperty.call(config, propName) &&
                // Skip over reserved prop names
                propName != "key" &&
                (enableRefAsProp || propName != "ref") &&
                propName != "__self" &&
                propName != "__source"
            ) {
                props[propName] = config[propName];
            }
        }
    }

    const childrenLength = arguments.length - 2;
    if (childrenLength == 1) {
        props.children = children;
    } else if (childrenLength > 1) {
        const childArray = children;
        if (__DEV__) {
            if (Object.freeze) {
                Object.freeze(childArray);
            }
        }
        props.children = childArray;
    }
    return SvelteElement(
        type,
        ref,
        CurrentOwner.current,
        props,
    );
}

export const svelte = __DEV__
    ? svelteDevWithDynamicChildren
    : svelteProd;

export const sveltes = __DEV__
    ? svelteDevWithStaticChildren
    : svelteProd;