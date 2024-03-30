<script lang="ts">
    import { state } from "$lib/State";
    import { modalController } from "$lib/components/modals/ModalController";
    import { useClient } from "$lib/controllers/ClientController";
    import type { API } from "revolt.js";

    export let embed: API.Embed,
        width = 0,
        height: number;
    let client = useClient();
    let autoplay = state.network.get("media")?.autoplay ;
</script>

{#if embed.type == "Website"}
    {#if embed.video}
        <video
            class="image"
            style:width="{width}px"
            style:height="{height}px"
            src={client.proxyFile(embed.video.url)}
            loop={embed.special?.type == "GIF"}
            controls={embed.special?.type != "GIF"}
            autoplay={embed.special?.type == "GIF" && autoplay}
            muted={embed.special?.type == "GIF" ? true : undefined}
        />
    {:else if embed.image}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img
            class="image"
            alt={embed.site_name}
            src={client.proxyFile(embed.image.url)}
            loading="lazy"
            style:width="100%"
            style:height="100%"
            on:click={() =>
                embed.type == "Website" &&
                modalController.push({
                    type: "image_viewer",
                    embed: embed.image ?? undefined,
                })}
            on:mousedown={(ev) =>
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
</style>
