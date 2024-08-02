<script lang="ts">
    import type { IText } from "svelte-slate/plugins";
    import type { RichText } from "./types";
    import MentionLeaf from "./MentionLeaf.svelte";
    export let leaf: IText & RichText;
</script>

{#if leaf.type == "mention"}
    <MentionLeaf>
        <slot />
    </MentionLeaf>
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
        <slot />
    </span>
{/if}
