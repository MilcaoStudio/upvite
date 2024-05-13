<script lang="ts">
    import { useClient } from "$lib/controllers/ClientController";
    import type { API, Channel, Nullable } from "revolt.js";
    import IconBase from "../IconBase.svelte";
    import BxHash from "svelte-boxicons/BxHash.svelte";
    import BxGroup from "svelte-boxicons/BxGroup.svelte";
    import fallback from "$lib/assets/group.png";

    export let server = false,
        size: number,
        target: Channel | null = null,
        attachment: Nullable<API.File> = null,
        animate = false;
    const client = useClient();
    $: iconURL = client.generateFileURL(
        target?.icon ?? attachment ?? undefined,
        { max_side: 256 },
        animate,
    );
    $: isServerChannel =
        server ||
        (target &&
            (target.channel_type == "TextChannel" ||
                target.channel_type == "VoiceChannel"));
    // The border radius of the channel icon, if it's a server-channel it should be square (undefined).
    let borderRadius: string | undefined = "--border-radius-channel-icon";
    if (isServerChannel) {
        borderRadius = undefined;
    }
</script>

{#if !iconURL && isServerChannel}
    {#if target?.channel_type == "VoiceChannel"}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-volume"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 8a5 5 0 0 1 0 8" />
            <path d="M17.7 5a9 9 0 0 1 0 14" />
            <path
                d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"
            />
        </svg>
    {:else}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-hash"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 9l14 0" />
            <path d="M5 15l14 0" />
            <path d="M11 4l-4 16" />
            <path d="M17 4l-4 16" />
        </svg>
    {/if}
{:else}
    <IconBase
        width={size}
        height={size}
        {borderRadius}
        aria-hidden
        viewBox="0 0 {size} {size}"
        {...$$restProps}
    >
        <foreignObject x="0" y="0" width="32" height="32" class="icon">
            <img
                src={iconURL ?? fallback}
                height={size}
                alt="icon"
                draggable={false}
                loading="lazy"
            />
        </foreignObject>
        <foreignObject width="16" height="16" x="16" y="16">
            {#if isServerChannel}
                <BxHash size={16} />
            {:else if iconURL}
                <BxGroup size={16} />
            {/if}
        </foreignObject>
    </IconBase>
{/if}
