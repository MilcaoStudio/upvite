<script lang="ts">
    import HeadPhone from "svelte-boxicons/BxHeadphone.svelte";
    import Download from "svelte-boxicons/BxDownload.svelte";
    import External from "svelte-boxicons/BxLinkExternal.svelte";
    import BxFile from "svelte-boxicons/BxFile.svelte";
    import BxVideo from "svelte-boxicons/BxVideo.svelte";
    import BxImage from "svelte-boxicons/BxImage.svelte";
    import { determineFileSize } from "$lib";
    import { useClient } from "$lib/controllers/ClientController";
    import type { File } from "revolt.js";
    import { detect } from "detect-browser";
    import IconButton from "$lib/components/atoms/input/IconButton.svelte";

    export let attachment: File;
    const client = useClient();
    let { filename, metadata, url, humanReadableSize } = attachment;
    $: open_url = `${url}/${filename}`;
    $: download_url = url?.replace("attachments", "attachments/download");
    let isFirefox = detect()?.name == "firefox";
</script>

{#if metadata.type == "Audio"}
    <div class="actions">
        <HeadPhone size={18} class="iconType" />
        <span>{filename}</span>
        <span class="fileSize">{humanReadableSize}</span>
        <a
            href={download_url}
            class="downloadIcon"
            download
            target={isFirefox || window.native ? "_blank" : "_self"}
            rel="noreferrer"
        >
            <IconButton>
                <Download size={24} />
            </IconButton>
        </a>
    </div>
{:else if metadata.type == "Image"}
    <div class="actions imageAction">
        <BxImage size={24} />
        <span>{filename}</span>
        <span class="fileSize">
            {`${metadata.width}x${metadata.height}`} ({humanReadableSize})
        </span>
        <a href={open_url} class="iconType" target="_blank" rel="noreferrer">
            <IconButton>
                <External size={24} />
            </IconButton>
        </a>
        <a
            href={download_url}
            class="downloadIcon"
            download
            target={isFirefox || window.native ? "_blank" : "_self"}
            rel="noreferrer"
        >
            <IconButton>
                <Download size={24} />
            </IconButton>
        </a>
    </div>
{:else if metadata.type == "Video"}
    <div class="actions">
        <BxVideo size={24} class="iconType" />
        <span>{filename}</span>
        <span class="fileSize">
            {`${metadata.width}x${metadata.height}`} ({humanReadableSize})
        </span>
        <a
            href={download_url}
            class="downloadIcon"
            download
            target={isFirefox || window.native ? "_blank" : "_self"}
            rel="noreferrer"
        >
            <IconButton>
                <Download size={24} />
            </IconButton>
        </a>
    </div>
{:else}
    <div class="actions">
        <BxFile size={24} class="iconType" />
        <span>{filename}</span>
        <span class="fileSize">{humanReadableSize}</span>
        <a
            href={open_url}
            class="externalType"
            target="_blank"
            rel="noreferrer"
        >
            <IconButton>
                <External size={24} />
            </IconButton>
        </a>
        <a
            href={download_url}
            class="downloadIcon"
            download
            target={isFirefox || window.native ? "_blank" : "_self"}
            rel="noreferrer"
        >
            <IconButton>
                <Download size={24} />
            </IconButton>
        </a>
    </div>
{/if}

<style>
    .actions.imageAction {
        grid-template:
            "name icon external download" auto
            "size icon external download" auto
            / minmax(20px, 1fr) min-content min-content;
    }

    .actions {
        display: grid;
        grid-template:
            "icon name external download" auto
            "icon size external download" auto
            / min-content minmax(20px, 1fr) min-content;

        align-items: center;
        column-gap: 12px;

        width: 100%;
        padding: 8px;
        overflow: none;

        color: var(--foreground);
        background: var(--secondary-background);
    }

    .actions span {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .fileSize {
        grid-area: size;

        font-size: 10px;
        color: var(--secondary-foreground);
    }

    .downloadIcon {
        grid-area: download;
    }

    .externalType {
        grid-area: external;
    }

    .iconType {
        grid-area: icon;
    }
</style>
