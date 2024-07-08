<script lang="ts">
    import { Slate, Editable, withSvelte } from "svelte-slate";
    import {
        createEditor,
        Text,
        type Range,
        type Descendant,
        type Path,
        type Node,
    } from "slate";
    import Prism from "$lib/markdown/prism";
    import Leaf from "$lib/markdown/Leaf.svelte";
    import type { Token } from "prismjs";
    import EditorArea from "$lib/markdown/EditorArea.svelte";
    export let value: Descendant[];
    const editor = withSvelte(createEditor());
    $: console.log("TextEditor value:", value);
    let decorate: (_entry: any) => unknown = ([node, path]: [Node, Path]) => {
        const ranges: Range[] = [];
        console.log(node);
        if (!Text.isText(node)) {
            return ranges;
        }
        function length(token: Token | string): number {
            if (typeof token == "string") {
                return token.length;
            } else if (!Array.isArray(token.content)) {
                return token.content.length;
            } else {
                return token.content.reduce((l, t) => l + length(t), 0);
            }
        }
        const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
        let start = 0;

        for (const token of tokens) {
            const len = length(token);
            const end = start + len;

            if (typeof token != "string") {
                ranges.push({
                    [token.type]: true,
                    anchor: { path, offset: start },
                    focus: { path, offset: end },
                });
            }

            start = end;
        }
        return ranges;
    };
</script>

<Slate {editor} bind:value>
    <Editable {decorate} {Leaf} Element={EditorArea} placeholder="" class="TextEditor" {...$$restProps} />
</Slate>

<style>
    :global(.TextEditor) {
        width: 100%;
    }
</style>
