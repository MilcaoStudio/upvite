<script lang="ts">
    import { run } from 'svelte/legacy';

    import { useClient } from "$lib/controllers/ClientController";
    import type { File, Channel } from "stoat.js";
    import IconBase from "../IconBase.svelte";
    import BxHash from "svelte-boxicons/BxHash.svelte";
    import BxMicrophone from "svelte-boxicons/BxMicrophone.svelte";
    import fallback from "$lib/assets/group.png";
    import { autorun } from "mobx";
    import { state } from "$lib/State";
    import BxPhoneCall from "svelte-boxicons/BxPhoneCall.svelte";
    import ImageIconBase from "../ImageIconBase.svelte";

    interface Props {
        server?: boolean;
        size: number;
        target?: Channel | null;
        attachment?: File | null;
        animate?: boolean;
        showBadge?: boolean;
        [key: string]: any
    }

    let {
        server = false,
        size,
        target = null,
        attachment = null,
        animate = false,
        showBadge = false,
        ...rest
    }: Props = $props();
    let badge = Math.max(16, Math.floor(size / 4));
    let max_side = $derived(state.network.media.shrinkMedia ? 64 : 256);
    const client = useClient();
    let iconURL;
    run(() => {
        iconURL = animate ? (target?.animatedIconURL || attachment?.createFileURL(true)) : (target?.iconURL || attachment?.createFileURL());
    });

    run(() => {
        autorun(
            () =>
            (iconURL = animate ? (target?.animatedIconURL || attachment?.createFileURL(true)) : (target?.iconURL || attachment?.createFileURL()))
        );
    });
    let isServerChannel =
        $derived(server ||
        (target && target.type == "TextChannel"));
    // The border radius of the channel icon, if it's a server-channel it should be square (undefined).
    let borderRadius: string | undefined = $state("--border-radius-channel-icon");
    if (isServerChannel) {
        borderRadius = undefined;
    }
</script>

{#if !iconURL && isServerChannel}
    {#if target?.isVoice}
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
        <div style="padding-left: 16px;">
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
        </div>
    {/if}
{:else if showBadge}
    <IconBase
        width={size + badge}
        height={size}
        aria-hidden
        viewBox="0 0 {size + badge} {size}"
        {...rest}
    >
        {#if iconURL}
            <foreignObject
                class="ChannelBadge"
                width={badge}
                height={badge}
                x="0"
                y="4"
            >
                {#if target?.isVoice}
                    <BxPhoneCall size={badge} strokeWidth={2} />
                {:else if target?.type == "TextChannel"}
                    <BxHash size={badge} strokeWidth={2} />
                {/if}
            </foreignObject>
        {/if}
        <foreignObject x={badge} y="0" width={size} height={size} class="icon">
            <img
                src={iconURL ?? fallback}
                height={size}
                alt="icon"
                draggable={false}
                loading="lazy"
            />
        </foreignObject>
    </IconBase>
{:else}
    <ImageIconBase
        alt="icon"
        {borderRadius}
        height={size}
        src={iconURL ?? fallback}
        draggable={false}
        loading="lazy"
        hover
    />
{/if}
