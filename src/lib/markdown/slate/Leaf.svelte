<script lang="ts">
    import type { IText } from "svelte-slate/plugins";
    import type { RichText } from "./types";
    import MentionLeaf from "./MentionLeaf.svelte";
    import EmojiLeaf from "./EmojiLeaf.svelte";
    interface Props {
        leaf: IText & RichText;
        children?: import('svelte').Snippet;
    }

    let { leaf, children }: Props = $props();
</script>

{#if leaf.type == "mention"}
    <MentionLeaf>
        {@render children?.()}
    </MentionLeaf>
{:else if leaf.type == "emoji"}
    <EmojiLeaf {leaf}>
        {@render children?.()}
    </EmojiLeaf>
{:else}
    <span
        data-slate-leaf="true"
        style:font-weight={leaf.bold ? "bold" : "normal"}
        style:font-style={leaf.italic ? "italic" : "normal"}
        style:text-decoration={leaf.underline
            ? "underline"
            : leaf.strikeThrough
              ? "line-through"
              : "none"}
    >
        {@render children?.()}
    </span>
{/if}
