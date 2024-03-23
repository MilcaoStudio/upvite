<script lang="ts">
    import ContextMenu from "$lib/components/context/ContextMenu.svelte";
    import { useClient } from "$lib/controllers/ClientController";
    import { cx } from "@emotion/css";
    import type { API } from "revolt.js";
    import SizedGrid from "./SizedGrid.svelte";
    import ImageView from "./ImageView.svelte";
    import AttachmentActions from "./AttachmentActions.svelte";
    import { state } from "$lib/State";
    import TextView from "./TextView.svelte";

    const client = useClient();
    export let attachment: API.File,
        hasContent = false;
    let { filename, metadata } = attachment;
    let spoiler = filename.startsWith("SPOILER_");
    const style = getComputedStyle(document.documentElement);
    let MAX_ATTACHMENT_WIDTH = parseInt(
        style.getPropertyValue("--attachment-max-width"),
    );
    let MAX_ATTACHMENT_HEIGHT = parseInt(
        style.getPropertyValue("--attachment-max-height"),
    );
    let { shrinkMedia } = state.network.get("media")!
    let url = client.generateFileURL(
        attachment,
        { width: shrinkMedia ? MAX_ATTACHMENT_WIDTH / 2 : MAX_ATTACHMENT_WIDTH * 1.5},
        true,
    );
</script>

{#if metadata.type == "Audio"}
    <div class="attachment audio" data-has-content={hasContent}>
        <AttachmentActions {attachment}/>
        <audio src={url} controls preload="metadata" />
    </div>
{:else if metadata.type == "Image"}
    <ContextMenu data={{ attachment }}>
        <SizedGrid
            width={metadata.width}
            height={metadata.height}
            className={cx(
                {
                    margin: hasContent,
                },
                {
                    spoiler: spoiler,
                },
            )}
        >
            <ImageView {attachment} src={url} />
            <!--TODO: Spoiler layer-->
        </SizedGrid>
    </ContextMenu>
{:else if metadata.type == "Text"}
    <div class="attachment text" data-has-content={hasContent}>
        <TextView {attachment} />
        <AttachmentActions {attachment}/>
    </div>
{:else if metadata.type == "Video"}
    <div
        class={cx({ margin: hasContent }, "container")}
        style="--width: {metadata.width}px;"
    >
        <AttachmentActions {attachment}/>
        <SizedGrid
            width={metadata.width}
            height={metadata.height}
            className={cx({ spoiler })}
        >
            <!-- svelte-ignore a11y-media-has-caption -->
            <video
                src={url}
                controls
                width={metadata.width}
                height={metadata.height}
                on:mousedown={(ev) =>
                    ev.button == 1 && window.open(url, "_blank")}
            />
            <!--TODO: Spoiler layer-->
        </SizedGrid>
    </div>
{:else}
    <div class="attachment file" data-has-content={hasContent}>
        <AttachmentActions {attachment}/>
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

    .file > :global(div) {
        padding: 12px;
        max-width: 100%;
        user-select: none;
        width: fit-content;
        border-radius: var(--border-radius);
        width: var(--attachment-default-width);
    }

    .margin {
        margin-top: 4px;
    }

    .text {
        width: 100%;
        overflow: hidden;
        grid-auto-columns: unset;
        max-width: var(--attachment-max-text-width);
    }
</style>
