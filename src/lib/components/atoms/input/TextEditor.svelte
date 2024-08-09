<script lang="ts">
    import { Slate, Editable, withSvelte } from "svelte-slate";
    import {
        createEditor,
        type Path,
        type Range,
        Text,
        type Descendant,
        Node,
    } from "slate";
    import Leaf from "$lib/markdown/slate/Leaf.svelte";
    import ElementRenderer from "$lib/markdown/slate/ElementRenderer.svelte";
    import type { KeyboardEventHandler } from "svelte/elements";
    import withMarkdown from "$lib/markdown/withMarkdown";
    import type { IElement } from "svelte-slate/plugins";
    import { onDestroy, onMount } from "svelte";
    import {
        RE_CHANNEL,
        RE_EMOJI,
        RE_MENTION,
    } from "$lib/markdown/plugins/remarkRegex";
    import Prism from "$lib/markdown/prism";
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
    function stringifyNodes(nodes: Descendant[]) {
        return nodes.map((n) => Node.string(n)).join("\n");
    }

    let ASTValue: IElement[] = [
        { type: "paragraph", children: [{ text: "" }] },
    ];

    function effect_value(_value: string) {
        const _ASTValue = [];
        for (const line of _value.split("\n")) {
            _ASTValue.push({ type: "paragraph", children: [{ text: line }] });
        }
        ASTValue = _ASTValue;
    }
    $: effect_value(value);

    function tokenLen(token: Prism.Token | string): number {
        return typeof token == "string"
            ? token.length
            : typeof token.content == "string"
              ? token.content.length
              : Array.isArray(token.content)
                ? token.content.reduce((l, t) => l + tokenLen(t), 0)
                : tokenLen(token.content);
    }

    function decorate([node, path]: [Node, Path]) {
        if (!Text.isText(node)) {
            return [];
        }
        const text = node.text;
        const ranges: (Range & { type?: string })[] = [];
        const tokens = Prism.tokenize(text, Prism.languages.markdown);

        let start = 0;
        for (const token of tokens) {
            const end = start + tokenLen(token);
            if (typeof token != "string") {
                ranges.push({
                    [token.type]: true,
                    anchor: { path, offset: start },
                    focus: { path, offset: end },
                });
            }
            start = end;
        }
        function mapMatch(match: string): [string, number] {
            const m = match.trim();
            return [m, text.indexOf(m)];
        }

        const mentions = (text.match(RE_MENTION) ?? ([] as string[]))
            .concat(text.match(RE_CHANNEL) ?? [])
            .map(mapMatch);

        mentions.forEach(([m, i]) =>
            ranges.push({
                anchor: { path, offset: i },
                focus: { path, offset: i + m.length },
                type: "mention",
            }),
        );

        (text.match(RE_EMOJI) ?? ([] as string[]))
            .map(mapMatch)
            .forEach(([m, i]) =>
                ranges.push({
                    anchor: { path, offset: i },
                    focus: { path, offset: i + m.length },
                    type: "emoji",
                }),
            );
        return ranges;
    }

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

<div class="TextEditor">
    <Slate
        {editor}
        value={ASTValue}
        on:value={(v) => {
            const content = stringifyNodes(v.detail);
            editor.move({ unit: "line" });
            console.debug(JSON.stringify(editor.selection));
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
                {decorate}
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
