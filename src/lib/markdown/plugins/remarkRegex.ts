import { RE_ULID } from "$lib";
import type { Handler } from "mdast-util-to-hast";
import { RE_CHANNELS, RE_MENTIONS } from "stoat.js";
import type { Plugin } from "unified";
import type { Root, Nodes } from "mdast";
import { SKIP, visit } from "unist-util-visit";

/**
 * Props given to custom components
 */
export interface CustomComponentProps {
    type?: string;
    match: string;
}

/**
 * Create a new custom component matched by a given RegExp
 * @param type mdast node type
 * @param regex Regex to match (must have at least one capture group)
 * @returns Unified Plugin
 */
export function createRemarkPlugin(
    type: string,
    regex: RegExp,
    validator?: (...args: string[]) => boolean,
): Plugin {
    /**
     * Plugin which transforms a given RegExp into a custom component with given name.
     */
    return () => {
        return (tree: Root) => {
            visit<Root, "text">(
                tree,
                "text",
                (node, index, parent,) => {
                    if (!parent || typeof index == "undefined") return;
                    const result = [];
                    let start = 0;

                    regex.lastIndex = 0;

                    let match = regex.exec(node.value);

                    while (match) {
                        if (!validator || validator(...match)) {
                            const position = match.index;

                            if (start !== position) {
                                result.push({
                                    type: "text",
                                    value: node.value.slice(start, position),
                                });
                            }
                            result.push({
                                type,
                                match: match[1],
                            });
                            start = position + match[0].length;
                        }

                        match = regex.exec(node.value);
                    }

                    if (result.length) {
                        if (start < node.value.length) {
                            result.push({
                                type: 'text',
                                value: node.value.slice(start),
                            });
                        }

                        //@ts-expect-error
                        parent.children.splice(index, 1, ...result);

                        return SKIP;
                    }
                },
            );
        };
    };
}

/**
 * Pass-through a component as-is from remark to rehype
 * @param name Tag name
 * @returns Handler
 */
export const passThroughRehype = (tagName: string): Handler => {
    return (state, node: Nodes & {properties: Record<string, any>},) => {
        // Extraer propiedades del nodo mdast
        const { properties = {}, ...rest } = node;
        
        // Construir elemento hast
        return {
            type: 'element',
            tagName,
            properties: {
                // Propiedades explícitas del nodo
                ...properties,
                // Propiedades adicionales del resto del nodo (si las hay)
                ...Object.fromEntries(
                    Object.entries(rest).filter(([k]) => 
                        !['type', 'position', 'children'].includes(k)
                    )
                ),
            },
            children: state.all(node),
        };
    };
};
/**
 * Pass-through multiple components at once
 * @param keys Tags
 * @returns Handlers
 */
export const passThroughComponents = (...keys: string[]) => {
    const obj: Record<string, Handler> = {};
    for (const key of keys) {
        obj[key] = passThroughRehype(key);
    }
    return obj;
};

export const RE_EMOJI = /:([a-zA-Z0-9\-_]+):/g;

export const remarkMention = createRemarkPlugin("mention", RE_MENTIONS, (_, match) =>
    RE_ULID.test(match),
);

export const remarkChannel = createRemarkPlugin("channel", RE_CHANNELS, (_, match) =>
    RE_ULID.test(match),
);

export const remarkEmoji = createRemarkPlugin("emoji", RE_EMOJI, (_, match) => RE_ULID.test(match));

export function isOnlyEmoji(text: string) {
    return !text.replaceAll(RE_EMOJI, "").trim().length;
}