<script lang="ts">
    import type { API } from "revolt.js";
    import EmbedMedia from "./EmbedMedia.svelte";
    import { modalController } from "$lib/components/modals/ModalController";
    import Markdown from "$lib/markdown/Markdown.svelte";
    import Attachment from "../attachments/Attachment.svelte";
    import { useClient } from "$lib/controllers/ClientController";
    import { state } from "$lib/State";

    export let embed: API.Embed;
    let client = useClient();
    let shrinkMedia = state.network.media.shrinkMedia;
    let root = getComputedStyle(document.documentElement);
    let maxWidth = parseInt(root.getPropertyValue("--embed-max-width")) / (shrinkMedia ? 2 : 1);
    let maxHeight = parseInt(root.getPropertyValue("--embed-max-height")) / (shrinkMedia ? 2 : 1);
    let maxPreviewSize = parseInt(
        root.getPropertyValue("--embed-max-preview-size"),
    ) / (shrinkMedia ? 2 : 1);
    let padding = parseInt(root.getPropertyValue("--embed-padding"));
    function calculateSize(
        w: number,
        h: number,
    ): { width: number; height: number } {
        const limitingWidth = Math.min(maxWidth, w);
        const limitingHeight = Math.min(maxHeight, h);

        // Calculate smallest possible WxH.
        const width = Math.min(limitingWidth, limitingHeight * (w / h));
        const height = Math.min(limitingHeight, limitingWidth * (h / w));

        return { width, height };
    }
    let mw = 0,
        mh = 0;
    $: largeMedia =
        embed.type == "Text"
            ? typeof embed.media != "undefined"
            : embed.type == "Website" &&
              (embed.special?.type != "None" || embed.image?.size == "Large");
    $: if (embed.type == "Text") {
        mw = maxWidth;
        mh = 1;
    }
    $: if (embed.type == "Website") {
        switch (embed.special?.type) {
            case "YouTube":
            case "Bandcamp":
                mw = embed.video?.width ?? 1280;
                mh = embed.video?.height ?? 720;
                break;
            case "Twitch":
            case "Lightspeed":
            case "Streamable":
                mw = 1280;
                mh = 720;
                break;
            default:
                if (embed.image?.size == "Preview") {
                    mw = maxWidth;
                    mh = Math.min(embed.image.height, maxPreviewSize);
                } else {
                    mw = embed.image?.width ?? maxWidth;
                    mh = embed.image?.height ?? 0;
                }
        }
    }
    $: size = calculateSize(mw, mh);
</script>

{#if embed.type == "Website" || embed.type == "Text"}
    {#if embed.type == "Website" && embed.special?.type == "GIF"}
        <EmbedMedia
            {embed}
            width={maxHeight *
                ((embed.image?.width ?? 1) / (embed.image?.height ?? 1))}
            height={maxHeight}
        />
    {:else}
        <div
            class="embed website"
            style:border-inline-start-color={embed.colour ??
                "var(--tertiary-backgrond)"}
            style:width="{size.width + padding}px"
        >
            <div>
                {#if embed.type == "Text"}
                    {#if embed.title}
                        <div class="siteinfo">
                            {#if embed.icon_url}
                                <img
                                    loading="lazy"
                                    class="favicon"
                                    alt="embed icon"
                                    src={client.proxyFile(embed.icon_url)}
                                    draggable="false"
                                    crossorigin="anonymous"
                                />
                            {/if}
                            <div class="site">{embed.title}</div>
                        </div>
                    {/if}
                    {#if embed.description}
                        <Markdown content={embed.description} />
                    {/if}
                    {#if largeMedia && embed.media}
                        <Attachment attachment={embed.media} />
                    {/if}
                {:else}
                    {#if embed.site_name}
                        <div class="siteinfo">
                            {#if embed.icon_url}
                                <img
                                    loading="lazy"
                                    class="favicon"
                                    alt=""
                                    src={client.proxyFile(embed.icon_url)}
                                    draggable="false"
                                    crossorigin="anonymous"
                                />
                            {/if}
                            <div class="site">{embed.site_name}</div>
                        </div>
                    {/if}
                    {#if embed.title}
                        <span>
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <a
                                on:mousedown={(ev) =>
                                    embed.type == "Website" &&
                                    (ev.button == 0 || ev.button == 1) &&
                                    modalController.openLink(
                                        embed.url ?? undefined,
                                        undefined,
                                        true,
                                    )}
                                class="title"
                            >
                                {embed.title}
                            </a>
                        </span>
                    {/if}
                    {#if embed.description}
                        <div class="description">
                            {embed.description}
                        </div>
                    {/if}
                    {#if largeMedia}
                        <EmbedMedia {embed} height={size.height} />
                    {/if}
                {/if}
            </div>
            {#if !largeMedia && embed.type == "Website"}
                <div>
                    <EmbedMedia
                        {embed}
                        width={size.height *
                            ((embed.image?.width ?? 1) /
                                (embed.image?.height ?? 1))}
                        height={size.height}
                    />
                </div>
            {/if}
        </div>
    {/if}
{:else if embed.type == "Image"}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <img
        class="embed image"
        alt="external"
        style:width={size.width}
        style:heigth={size.height}
        src={client.proxyFile(embed.url)}
        loading="lazy"
        on:click={() =>
            embed.type == "Image" &&
            modalController.push({ type: "image_viewer", embed })}
        on:mousedown={(ev) =>
            ev.button == 1 &&
            embed.type == "Image" &&
            modalController.openLink(embed.url, undefined, true)}
    />
{:else if embed.type == "Video"}
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
        class="embed image"
        style:width={size.width}
        style:height={size.height}
        src={client.proxyFile(embed.url)}
        controls
    />
{/if}

<style>
    .embed {
        margin: 0.2em 0;
    }

    .embed.image {
        cursor: pointer;
    }

    .embed.website {
        gap: 6px;
        flex-direction: row;
        border-inline-start-width: 4px;
        border-inline-start-style: solid;

        padding: 12px;
        width: fit-content;
        background: var(--primary-header);
        border-radius: var(--border-radius);
    }

    .embed.website > div:nth-child(1) {
        gap: 6px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    .siteinfo {
        display: flex;
        align-items: center;
        gap: 6px;
        user-select: none;
    }

    .favicon {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
    }

    .site {
        font-size: 11px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: var(--secondary-foreground);
    }

    .title {
        display: inline-block;
        font-size: 1.1em;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .title:hover {
        text-decoration: underline;
    }

    .description {
        font-size: 12px;
        overflow: hidden;
        display: -webkit-box;
        white-space: pre-wrap;
        -webkit-line-clamp: 6;
        -webkit-box-orient: vertical;
    }

    :global(a) {
        cursor: pointer;
    }
</style>
