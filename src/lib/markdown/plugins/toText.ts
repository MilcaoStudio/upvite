import type { Root } from "hast";
import type { Plugin } from "unified";
import { SKIP, visit } from "unist-util-visit";

export const remarkHtmlToText: Plugin = () => {
    return (tree: Root) => {
        visit(tree, "html", (node: { type: string; value: string }, index, parent) => {
            if (parent && index !== undefined) {
                const textNode = {
                    type: 'text',
                    value: node.value,
                };
                //@ts-expect-error
                parent.children[index] = textNode;
                
                return SKIP;
            }
        });
    };
};