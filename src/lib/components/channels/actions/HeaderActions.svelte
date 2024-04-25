<script lang="ts">
    import { chainedDefer } from "$lib";
    import { internalEmit } from "$lib/InternalEmitter";
    import { state } from "$lib/State";
    import IconButton from "$lib/components/atoms/input/IconButton.svelte";
    import Group from "svelte-boxicons/BxGroup.svelte";
    import { SIDEBAR_MEMBERS, Viewport } from "$lib/stores/Layout";
    import type { Channel } from "revolt.js";
    //import VoiceActions from "./actions/VoiceActions.svelte";

    export const channel: Channel | undefined = undefined;
    let isVertical = state.layout.getViewport() == Viewport.SMALL;
    function slideOpen() {
        if (!isVertical) return;
        const panels = document.querySelector(".snap");
        panels?.scrollTo({
            behavior: "smooth",
            left: panels.clientWidth * 3,
        });
    }

    function openMembers() {
        if (!isVertical) {
            state.layout.toggleSectionState(SIDEBAR_MEMBERS, true);
        }

        slideOpen();
        chainedDefer(() => internalEmit("RightSidebar", "open"));
    }
</script>

<div class="Container">
    <!--TODO: Actions-->
    <!--
    {#if channel.channel_type == "VoiceChannel"}
        
        <VoiceActions {channel} />
    {/if}-->
    <IconButton onClick={openMembers}>
        <Group size={25} />
    </IconButton>
</div>

<style>
    div.Container {
        display: flex;
        gap: 16px;
    }
</style>