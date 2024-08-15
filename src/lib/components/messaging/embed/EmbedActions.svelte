<script lang="ts">
    import IconButton from "$lib/components/atoms/input/IconButton.svelte";
    import type { API } from "revolt.js";
    import LinkExternal from "svelte-boxicons/BxLinkExternal.svelte";

    export let embed: API.Image;
    $: filename = embed.url.split("/").pop();
</script>

<div class="actions">
    <span class="filename">{filename}</span>
    <span class="filesize">
        {embed.width}x{embed.height}
    </span>
    <a href={embed.url} class="openicon" target="_blank" rel="noreferrer">
        <IconButton>
            <LinkExternal size={24} />
        </IconButton>
    </a>
</div>

<style>
    .actions {
        display: grid;
        grid-template:
            "name open" auto
            "size open" auto
            / minmax(20px, 1fr) min-content;

        align-items: center;
        column-gap: 12px;

        width: 100%;
        padding: 8px;
        overflow: none;

        color: var(--foreground);
        background: var(--secondary-background);
    }

    span {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .filesize {
        grid-area: size;

        font-size: 10px;
        color: var(--secondary-foreground);
    }
    
    .openicon {
        grid-area: open;
    }
</style>
