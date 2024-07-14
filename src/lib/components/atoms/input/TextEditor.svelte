<script lang="ts">
    import {
        Slate,
        Editable,
        withSvelte,
        focus,
        toDOMPoint,
    } from "svelte-slate";
    import {
        createEditor,
        Text,
        Element,
        Transforms,
        type Descendant,
        type Path,
        Node,
        Point
    } from "slate";
    import Leaf from "$lib/markdown/slate/Leaf.svelte";
    import ElementRenderer from "$lib/markdown/slate/ElementRenderer.svelte";
    import type {
        KeyboardEventHandler,
    } from "svelte/elements";
    import withMarkdown from "$lib/markdown/withMarkdown";
    import remarkSlate from "$lib/markdown/plugins/remarkSlate";
    import { remarkProcessor } from "$lib/markdown/RemarkRenderer.svelte";
    import type { IElement } from "svelte-slate/plugins";
    import { onDestroy, onMount } from "svelte";
    export let value = "",
        minHeight = 0,
        onChange: (
            value: string,
            selectionStart?: number,
            selectionEnd?: number,
        ) => void,
        onKeyDown: KeyboardEventHandler<HTMLDivElement>,
        onFocus: () => void,
        onBlur: (() => void) | undefined = undefined;

    let ref: HTMLDivElement | undefined;
    function stringifyNodes(nodes: Descendant[]){
        return nodes.map(n => Node.string(n)).join('\n')
    }

    $: console.log("value", value.length, value);
    //$: setValue(value);

    function equals(obj1: Descendant, obj2: Descendant): boolean {
        return (
            typeof obj1 == typeof obj2 &&
            (Text.equals(obj1, obj2) ||
                (Element.isElement(obj1) &&
                    Element.isElement(obj2) &&
                    obj1.children == obj2.children))
        );
    }

    function mergeTexts(text1: string, text2: string, mode: "longest" = "longest") {
        let chars: string[] = []
        if (typeof mode != "string") {
            throw TypeError("mode should be a string");
        }
        if (mode == "longest") {
            const [longest, shortest] = text1.length > text2.length ? [text1, text2] : [text2, text1];
            for (let longIndex = longest.length - 1, shortIndex = shortest.length - 1; longIndex >= 0; longIndex--) {
                const lChar = longest.charAt(longIndex);
                chars.unshift(lChar);
                if (shortest.charAt(shortIndex) == lChar) {
                    if (--shortIndex < 0) {
                        return longest.slice(0, longIndex) + chars.join("")
                    }
                }
            }

        }
        return chars.join("");
    }

    function setValue(_value: string) {
        console.debug("_value", _value);
        remarkProcessor()
            .use(remarkSlate)
            .process(_value, (err, file) => {
                if (err) throw err;
                console.log(
                    "[unified] Rendered tree",
                    JSON.stringify(file?.result),
                );
                if (Array.isArray(file?.result)) {
                    const children: IElement[] = file.result;
                    function mergeNodes(
                        node1: Descendant,
                        node2: Descendant,
                        path: Path,
                    ) {
                        if (true) {
                            if (Text.isText(node1) && Text.isText(node2) && node1.text != node2.text) {
                                // Overrides current text node
                                //editor.insertText(mergeTexts(node1.text, node2.text), {at: path});
                                const dpoint = toDOMPoint(editor, {path, offset: node1.text.length});
                                console.debug(dpoint);
                                // Mounted text node has same string length
                                //dpoint[0].textContent = node2.text;
                            }
                            //if (node2.type == "mention") debugger;
                            //console.log("diff found, path", path);
                            console.log("Running mergeNodes in", path);
                            const fn = editor.hasPath(path)
                                ? Transforms.setNodes
                                : Transforms.insertNodes;
                            fn(editor, node2, { at: path, voids: true,  });
                            if (Element.isElement(node1) && Element.isElement(node2)) {
                                for (let j = 0; j < Math.max(node1.children.length, node2.children.length); j++) {
                                    mergeNodes(node1.children[j], node2.children[j], [path[0], j]);
                                }
                            }
                        }
                    }
                    for (
                        let i = 0;
                        i < Math.max(editor.children.length, children.length);
                        i++
                    ) {
                        mergeNodes(editor.children[i], children[i], [i]);
                    }
                    console.debug(
                        "Actual tree",
                        JSON.stringify(editor.children),
                    );
                    //ASTValue = children;
                }
            });
    }

    /*let ASTValue: IElement[] = [
        { type: "paragraph", children: [{ text: "" }] },
    ];*/
    let ASTValue: IElement[] = [
        {
            type: "paragraph",
            children: [{
                text: "--->"
            }, {
                text: "<--"
            }]
        }
    ]
    $: console.log("AST value", JSON.stringify(ASTValue));
    const editor = withMarkdown(withSvelte(createEditor()));
    onMount(() => {
        ref?.addEventListener("focus", onFocus);
        onBlur && ref?.addEventListener("blur", onBlur);
    });
    onDestroy(() => {
        ref?.removeEventListener("focus", onFocus);
        onBlur && ref?.removeEventListener("blur", onBlur);
    });
</script>

<div
    class="TextEditor"
    on:focus={(e) => {
        focus(editor);
    }}
>
    <Slate
        {editor}
        value={ASTValue}
        on:value={(v) => {
            console.debug("on:value", JSON.stringify(v.detail));
            const content = stringifyNodes(v.detail);
            //value = content;
            onChange(
                content,
                editor.selection?.anchor.offset,
                editor.selection?.focus.offset,
            );
        }}
    >
        <div style:min-height="{minHeight}px">
            <Editable
                bind:ref
                {Leaf}
                Element={ElementRenderer}
                placeholder=""
                autoFocus
                onKeyDown={(e) => {
                    onKeyDown(e);
                }}
                {...$$restProps}
            />
        </div>
    </Slate>
</div>

<style>
    .TextEditor {
        padding: var(--message-box-padding);
        flex-grow: 1;
        display: flex;
        font-size: var(--text-size);
    }
    .TextEditor > div {
        color: var(--foreground);
        width: 100%;
        border-radius: var(--border-radius-inner);
        border: var(--input-border-width) solid var(--secondary-foreground);
        padding: 2px;
        transition: border-color 0.2s ease-in-out;
    }
</style>
