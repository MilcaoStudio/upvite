<script lang="ts">
    import { useClient } from "$lib/controllers/ClientController";
    import type { API, Channel, Nullable } from "revolt.js";
    import { BxHash, BxVolumeFull } from "svelte-boxicons";
    import ImageIconBase from "../ImageIconBase.svelte";
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
        <BxVolumeFull {size} />
    {:else}
        <BxHash {size} />
    {/if}
{:else}
    <ImageIconBase
        width={size}
        height={size}
        loading="lazy"
        aria-hidden
        {borderRadius}
        src={iconURL ?? fallback}
        {...$$restProps}
    />
{/if}
