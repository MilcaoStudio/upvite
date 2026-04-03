import type { Component } from "svelte";

let __DEV__ = true;
export type SVNode<P extends Record<string, any> = {}> =
    | {
        type: 'text';
        value: string | number | boolean;
    }
    | {
        type: 'element';
        tagName: string;
        props: P;
        children: SVNode[];
    }
    | {
        type: 'component';
        component: Component<P>;
        props: P;
        children: SVNode[];
    };

type Props = {
    [x: string]: any,
    children?: SVNode[],
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

function isValidElementType(type: string | Function) {
    return typeof type == "string" || typeof type == "function"
}

export function svelteDevWithDynamicChildren(type: string | Component,
    config: Props,
) {
    if (__DEV__) {
        const isStaticChildren = false;
        return svelteDEV(type, config, isStaticChildren);
    }
}

export function svelteDevWithStaticChildren(
    type: string | Component,
    config: Props,
) {
    if (__DEV__) {
        const isStaticChildren = true;
        return svelteDEV(type, config, isStaticChildren);
    }
}

function SvelteElement(type: string | Component, props: Record<string, any>, children: SVNode[] = []) {
    let element: Record<string, any> = {
        props,
        children,
    }

    if (typeof type == "function") {
        element.type = "component";
        element.component = type;
    }

    if (typeof type == "string") {
        element.type = "element";
        element.tagName = type;
    }

    if (__DEV__) {
        if (Object.freeze) {
            Object.freeze(element.props);
            Object.freeze(element);
        }
    }
    return element as SVNode;
}

export function svelteProd(type: string | Component, config: Props) {
    const { children, ...props } = config;
    return SvelteElement(type, props, children);
}

export function svelteDEV(type: string | Component, config: Props, isStaticChildren: boolean) {

    const { children, ...props } = config;
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
            'html elements) or a class/function (for components)' +
            ' but got: %s.%s', typeString, info,);
    } else {
        if (children) {
            if (isStaticChildren) {
                if (Array.isArray(children)) {
                    if (Object.freeze) {
                        Object.freeze(children);
                    }
                } else {
                    console.error(
                        'Svelte: Static children should always be an array. '
                    );
                }
            }
        }
    }

    const element = SvelteElement(
        type,
        props,
    );

    return element
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

export function createElement(type: string | Component, config: Props | null, ...children: SVNode[]) {
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
                'svelte.createElement: type is invalid -- expected a string (for html elements) ' +
                'or a class/function (for components) ' +
                'but got: %s.%s',
                typeString,
                info,
            );
        }
    }

    let propName: string
    const props: Record<string, any> = {};
    if (config != null) {
        // Remaining properties are added to a new props object
        for (propName in config) {
            if (config.hasOwnProperty(propName)) {
                props[propName] = config[propName];
            }
        }
    }

    return SvelteElement(
        type,
        props,
        children,
    );
}

export const svelte = __DEV__
    ? svelteDevWithDynamicChildren
    : svelteProd;

export const sveltes = __DEV__
    ? svelteDevWithStaticChildren
    : svelteProd;