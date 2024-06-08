<script lang="ts">
    import { chainedDefer } from "$lib";
    import { internalEmit } from "$lib/InternalEmitter";
    import { state } from "$lib/State";
    import IconButton from "$lib/components/atoms/input/IconButton.svelte";
    import Group from "svelte-boxicons/BxGroup.svelte";
    import UserPlus from "svelte-boxicons/BxUserPlus.svelte";
    import Cog from "svelte-boxicons/BxCog.svelte";
    import { SIDEBAR_MEMBERS, Viewport } from "$lib/stores/Layout";
    import type { Channel } from "revolt.js";
    import { modalController } from "$lib/components/modals/ModalController";

    import VoiceActions from "./VoiceActions.svelte";

    export let channel: Channel;
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
    
    {#if channel.type == "VoiceChannel"}
        <VoiceActions {channel} />
    {/if}
    {#if channel.type == "Group"}
        <IconButton href="/channel/{channel.id}/settings">
            <Cog size={24} />
        </IconButton>
        <IconButton
            onClick={() =>
                modalController.push({
                    type: "user_picker",
                    omit: [...channel.recipientIds.values()],
                    callback: async (users) =>
                        users.forEach((user) => channel.addMember(user)),
                })}
        >
            <UserPlus size={24} />
        </IconButton>
    {/if}
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
