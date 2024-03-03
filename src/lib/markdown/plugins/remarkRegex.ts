import { RE_ULID } from "$lib";
import { clientController } from "$lib/controllers/ClientController";
import type { Handler } from "mdast-util-to-hast";
import { RevoltEmojiDictionary } from "revkit";
import { RE_MENTIONS } from "revolt.js";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

/**
 * Props given to custom components
 */
export interface CustomComponentProps {
    type?: string;
    match: string;
    arg1?: string;
}

/**
 * Create a new custom component matched by a given RegExp
 * @param type hast node type
 * @param regex Regex to match (must have one capture group)
 * @returns Unified Plugin
 */
export function createComponent(
    type: string,
    regex: RegExp,
    validator?: (match: string) => boolean,
): Plugin {
    /**
     * Plugin which transforms a given RegExp into a custom component with given name.
     */
    return () => {
        return (tree) => {
            visit(
                tree,
                "text",
                (
                    node: { value: string },
                    index: number,
                    parent: { children: any[] },
                ) => {
                    const result = [];
                    let start = 0;

                    regex.lastIndex = 0;

                    let match = regex.exec(node.value);

                    while (match) {
                        if (!validator || validator(match[1])) {
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
                                arg1: match[2],
                            });
                            start = position + match[0].length;
                        }

                        match = regex.exec(node.value);
                    }

                    if (
                        result.length > 0 &&
                        parent &&
                        typeof index === "number"
                    ) {
                        if (start < node.value.length) {
                            result.push({
                                type: "text",
                                value: node.value.slice(start),
                            });
                        }

                        parent.children.splice(index, 1, ...result);
                        return index + result.length;
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
export const passThroughRehype: (name: string) => Handler =
    (name: string) => (s, node) => { return { type: "element", tagName: name, properties: { ...node }, children: s.all(node) } }

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

export const remarkMention = createComponent("mention", RE_MENTIONS, (match) =>
    clientController.availableClient.users.has(match),
);

export const remarkChannel = createComponent("channel", /<#([A-z0-9]{26})>/g, (match) =>
    clientController.availableClient.channels.has(match)
);

const RE_EMOJI = /:([a-zA-Z0-9\-_]+):/g;

export const remarkEmoji = createComponent("emoji", RE_EMOJI, (match) => match in RevoltEmojiDictionary || RE_ULID.test(match));

export function isOnlyEmoji(text: string) {
    return !text.replaceAll(RE_EMOJI, "").trim().length;
}