<script module lang="ts">
    import { unified, type Processor } from "unified";
    import remarkParse from "remark-parse";
    import remarkBreaks from "remark-breaks";
    import remarkMath from "remark-math";
    import UserMention from "./plugins/UserMention.svelte";
    import ChannelLink from "./plugins/ChannelLink.svelte";
    import { remarkTimestamps } from "./plugins/timestamps";
    import { remarkHtmlToText } from "./plugins/toText";
    import remarkRehype from "remark-rehype";
    import remarkGfm from "remark-gfm";
    import { handlers } from "./hast";
    import rehypePrism from "rehype-prism";
    import "./prism";
    import rehypeSvelte from "./plugins/rehypeSvelte";
    import {
        createElement,
        type SVNode,
    } from "./runtime/svelteRuntime";
    import { css, cx } from "@emotion/css";

    
    // disables <@id> as email link
    export const micromarkExtensions = [{disable: {null: ["autolink"]}}];
    export const remarkProcessor = unified()
        .data({micromarkExtensions})
        .use(remarkParse)
        .use(remarkBreaks)
        .use(remarkMath)
        .use(remarkMention)
        .use(remarkChannel)
        .use(remarkEmoji)
        .use(remarkTimestamps)
        .use(remarkGfm)
        .use(remarkHtmlToText);
    
    /**
     * Regex for matching execessive recursion of blockquotes and lists
     */
    const RE_RECURSIVE =
        /(^(?:[>*+-][^\S\r\n]*){5})(?:[>*+-][^\S\r\n]*)+(.*$)/gm;

    /**
     * Regex for matching multi-line blockquotes
     */
    const RE_BLOCKQUOTE = /^([^\S\r\n]*>[^\n]+\n?)+/gm;

    /**
     * Regex for matching HTML tags
     */
    const RE_HTML_TAGS = /^(<\/?[a-zA-Z0-9]+>)(.*$)/gm;

    /**
     * Regex for matching empty lines
     */
    const RE_EMPTY_LINE = /^\s*?$/gm;

    /**
     * Regex for matching line starting with plus
     */
    const RE_PLUS = /^\s*\+(?:$|[^+])/gm;

    function sanitise(content: string) {
        return (
            content
                // Strip excessive blockquote or list indentation
                .replace(RE_RECURSIVE, (_, m0, m1) => m0 + m1)

                // Append empty character if string starts with html tag
                // This is to avoid inconsistencies in rendering Markdown inside/after HTML tags
                // https://github.com/revoltchat/revite/issues/733
                .replace(RE_HTML_TAGS, (match) => `\u200E${match}`)

                // Append empty character if line starts with a plus
                // which would usually open a new list but we want
                // to avoid that behaviour in our case.
                .replace(RE_PLUS, (match) => `\u200E${match}`)

                // Replace empty lines with non-breaking space
                // because remark renderer is collapsing empty
                // or otherwise whitespace-only lines of text
                .replace(RE_EMPTY_LINE, "‎")

                // Ensure empty line after blockquotes for correct rendering
                .replace(RE_BLOCKQUOTE, (match) => `${match}\n`)
        );
    }
</script>

<script lang="ts">
    import Anchor from "./plugins/Anchor.svelte";
    import { remarkChannel, remarkEmoji, remarkMention } from "./plugins/remarkRegex";
    import Emoji from "./plugins/Emoji.svelte";
    import type { Component } from "svelte";
    import NodeRenderer from "./NodeRenderer.svelte";

    interface Props {
        content: string;
    }

    let { content }: Props = $props();
    const components: Record<string, string | Component<any> | null> = {
        a: Anchor,
        code: "code",
        channel: ChannelLink,
        emoji: Emoji,
        li: "li",
        mention: UserMention,
        ol: "ol",
        pre: "pre",
        table: "table",
        ul: "ul",
        // Block image elements
        img: null,
        // Catch literally everything else just in case
        video: null,
        figure: null,
        picture: null,
        source: null,
        audio: null,
        script: null,
        style: null,
    };

    const rehypeProcessor: Processor = remarkProcessor()
        // Mdast to Hast
        .use(remarkRehype, { handlers, })
        // code block highlight
        .use(rehypePrism)
        // Hast to svelte elements
        .use(rehypeSvelte, { createElement, components });
        
    let sanitisedContent = $derived(sanitise(content));
    const Markdown = cx(
        "Markdown",
        css`
            .math-display {
                overflow-x: auto;
            }

            // TODO: Large emoji feature
        `,
    );
    let rootNode = $state<SVNode>();
    $effect(() => {
        rehypeProcessor
            .process(sanitisedContent)
            .then((file) => (rootNode = file.result as SVNode))
            .catch(() => {
                rootNode = {
                    type: "text",
                    value: sanitisedContent,
                };
            });
    });
    $inspect(rootNode);
    // TODO: Big emoji feature
    // $: largeEmoji = !disallowBigEmoji && isOnlyEmoji(content)
</script>


{#if rootNode}    
    <div class={Markdown}>
        <NodeRenderer node={rootNode} />
    </div>
{/if}

<style>
    .Markdown :global(p) {
        margin: 0px;
    }
    .Markdown :global(p > code) {
        padding: 1px 4px;
        flex-shrink: 0;
    }
    .Markdown :global(h1),
    .Markdown :global(h2),
    .Markdown :global(h3),
    .Markdown :global(h4),
    .Markdown :global(h5),
    .Markdown :global(h6) {
        margin: 0.2em 0;
    }
</style>
