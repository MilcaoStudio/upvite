<script lang="ts">
    import ContextMenu from "$lib/components/context/ContextMenu.svelte";
    import { useClient } from "$lib/controllers/ClientController";
    import { cx } from "@emotion/css";
    import type { API } from "revolt.js";

    const client = useClient();
    export let attachment: API.File,
        hasContent = false;
    let { filename, metadata } = attachment;
    let type = metadata.type;
    let spoiler = filename.startsWith("SPOILER_");
    const style = getComputedStyle(document.documentElement);
    let MAX_ATTACHMENT_WIDTH = parseInt(
        style.getPropertyValue(
            "--attachment-max-width",
        ),
    );
    let MAX_ATTACHMENT_HEIGHT = parseInt(
        style.getPropertyValue(
            "--attachment-max-height",
        ),
    );
    let url = client.generateFileURL(
        attachment,
        { width: MAX_ATTACHMENT_WIDTH * 1.5 },
        true,
    );
</script>

{#if type == "Audio"}
    <div class="attachment audio" data-has-content={hasContent}>
        <!--<AttachmentActions {attachment}/>-->
        <audio src={url} controls preload="metadata" />
    </div>
{:else if type == "Image"}
    <ContextMenu data={{ attachment }}>
        <!--<SizedGrid ... />-->
        <div
            class={cx(
                {
                    margin: hasContent,
                },
                {
                    spoiler: spoiler,
                },
            )}
            style="width:{metadata.type == 'Image' &&
                Math.min(metadata.width, MAX_ATTACHMENT_WIDTH)}px;height:{metadata.type == "Image" && Math.min(metadata.height, MAX_ATTACHMENT_HEIGHT)}px;"
        >
            <img
                alt={filename}
                src={url}
                width="100%"
                height="100%"
            />
            <!--TODO: Spoiler layer-->
        </div>
    </ContextMenu>
{:else if type == "Text"}
    <div class="attachment text" data-has-content={hasContent}>
        <!--<TextFile {attachment} />-->
        <a href={url}>{filename}</a>
        <!--<AttachmentActions {attachment}/>-->
    </div>
{:else if type == "Video"}
    <div
        class={cx({ margin: hasContent }, "container")}
        style="--width: {metadata.type == 'Video' && metadata.width}px;"
    >
        <!--<AttachmentActions {attachment}/>-->
        <!--<SizedGrid ... />-->
        <div class={cx({ spoiler: spoiler }, "attachment")}>
            <!-- svelte-ignore a11y-media-has-caption -->
            <video
                src={url}
                controls
                width={Math.min(
                    metadata.type == "Video" ? metadata.width : 0,
                    MAX_ATTACHMENT_WIDTH,
                )}
                height={Math.min(
                    metadata.type == "Video" ? metadata.height : 0,
                    MAX_ATTACHMENT_HEIGHT,
                )}
                on:mousedown={(ev) =>
                    ev.button == 1 && window.open(url, "_blank")}
            />
            <!--TODO: Spoiler layer-->
        </div>
    </div>
{:else}
    <div class="attachment file" data-has-content={hasContent}>
        <!--<AttachmentActions {attachment}/>-->
        <a href={url}>{filename}</a>
    </div>
{/if}

<style>
    .attachment {
        display: grid;
        grid-auto-flow: row dense;
        grid-auto-columns: min(100%, var(--attachment-max-width));

        margin: 0.125rem 0 0.125rem;
        width: max-content;
        max-width: 100%;
    }

    .audio {
        gap: 4px;
        padding: 6px;
        display: flex;
        max-width: 100%;
        flex-direction: column;
        width: var(--attachment-default-width);
        background: var(--secondary-background);
    }

    .audio > audio {
        width: 100%;
    }

    .container {
        overflow: hidden;
        width: fit-content;
    }
    .container > :first-child {
        width: min(var(--attachment-max-width), 100%, var(--width));
    }

    .container,
    .attachment,
    .image {
        border-radius: var(--border-radius);
    }

    .file > div {
        padding: 12px;
        max-width: 100%;
        user-select: none;
        width: fit-content;
        border-radius: var(--border-radius);
        width: var(--attachment-default-width);
    }

    .image {
        cursor: pointer;
        width: 100%;
        height: 100%;
    }

    .image.loading {
        background: var(--background);
    }

    .text {
        width: 100%;
        overflow: hidden;
        grid-auto-columns: unset;
        max-width: var(--attachment-max-text-width);
    }

    .text .textContent {
        height: 140px;
        padding: 12px;
        overflow-x: auto;
        overflow-y: auto;
        border-radius: 0;
        background: var(--secondary-header);
    }
</style>
