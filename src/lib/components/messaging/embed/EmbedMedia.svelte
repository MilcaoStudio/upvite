<script lang="ts">
    import { modalController } from "$lib/components/modals/ModalController";
    import type { WebsiteEmbed } from "stoat.js";
    import { isWebsiteEmbed } from "./MessageEmbed";
    import { useClient } from "$lib/components/client/ClientContext.svelte";
    import { useState } from "$lib/components/state/StateContext.svelte";

    interface Props {
        embed: WebsiteEmbed;
        width?: number;
        height: number;
    }

    let { embed, width = 0, height }: Props = $props();
    let network = useState().network;
    let locale = useState().locale;
    let client = useClient();
    let autoplay = network.media.autoplay;
    
</script>

{#if isWebsiteEmbed(embed)}
    {#if embed.specialContent?.type == "YouTube"}
        <iframe
            title="YouTube"
            {height}
            loading="lazy"
            src="http://www.youtube-nocookie.com/embed/{embed.specialContent.id}?modestbranding=1&hl={locale.getLanguage()}&start={embed.specialContent.timestamp ?? 0}"
            frameborder="0"
            allowfullscreen
></iframe>
    {:else if embed.video}
        <video
            class="image"
            style:width="{width}px"
            style:height="{height}px"
            src={client.proxyFile(embed.video.url)}
            loop={embed.specialContent?.type == "GIF"}
            controls={embed.specialContent?.type != "GIF"}
            autoplay={embed.specialContent?.type == "GIF" && autoplay}
            muted={embed.specialContent?.type == "GIF" ? true : undefined}
            onclick={(ev) =>
                ev.currentTarget.paused && ev.currentTarget.play()}
></video>
    {:else if embed.image}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <img
            class="image"
            alt={embed.siteName}
            src={client.proxyFile(embed.image.url)}
            loading="lazy"
            style:width="100%"
            style:height="100%"
            onclick={() =>
                embed.type == "Website" &&
                modalController.push({
                    type: "image_viewer",
                    embed: embed.image ?? undefined,
                })}
            onmousedown={(ev) =>
                embed.type == "Website" &&
                ev.button == 1 &&
                window.open(embed.image?.url, "_blank")}
        />
    {/if}
{/if}

<style>
    img.image {
        cursor: pointer;
        object-fit: contain;
        border-radius: var(--border-radius);
    }

    iframe {
        border: none;
        border-radius: var(--border-radius);
        width: 100%;
    }
</style>
