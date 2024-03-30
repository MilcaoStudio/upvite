<script lang="ts">
    import type { API } from "revolt.js";
    import EmbedMedia from "./EmbedMedia.svelte";

    export let embed: API.Embed;
    let root = getComputedStyle(document.documentElement);
    let maxWidth = parseInt(root.getPropertyValue("--embed-max-width"));
    let maxHeight = parseInt(root.getPropertyValue("--embed-max-height"));
</script>

{#if embed.type == "Website" && embed.special?.type == "GIF"}
    <EmbedMedia {embed} width={maxHeight * ((embed.image?.width ?? 1) / (embed.image?.height ?? 1))} height={maxHeight} />
{/if}