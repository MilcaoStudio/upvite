<script lang="ts">
    import { internalSubscribe } from "$lib/InternalEmitter";
    import { state } from "$lib/State";
    import { reaction } from "mobx";
    import type { Channel } from "revolt.js";
    import ChannelHeader from "./ChannelHeader.svelte";
    import { ErrorBoundary, createBoundary } from "$lib/error/errorBoundary";
    import { isTouchscreenDevice } from "$lib";
    import { SIDEBAR_MEMBERS } from "$lib/stores/Layout";
    import RightSidebar from "../navigation/RightSidebar.svelte";

    export let channel: Channel;
    const layout = state.layout;

    let lastId: string | undefined;
    internalSubscribe("NewMessages", "hide", ()=>lastId = undefined)
    internalSubscribe("NewMessages", "mark", (id)=>{if (typeof id == 'string') lastId = id})
    $: {
        lastId = channel.unread
                ? channel.client.unreads?.getUnread(channel._id)?.last_id ?? undefined
                : undefined;
        const checkUnread = () =>
            channel.unread &&
            channel.client.unreads!.markRead(
                channel._id,
                channel.last_message_id!,
                true,
            );
        checkUnread();
        reaction(
            () => channel.last_message_id,
            () => checkUnread(),
        );
    }
</script>

<ChannelHeader {channel} />
<div class="ChannelMain" data-component="channel">
    <ErrorBoundary section="renderer">
        <div class="ChannelContent">
            Bienvenido al canal {channel.name}
            <!--<VoiceHeader id={channel._id} />
                <NewMessages channel={channel} last_id={lastId} />
                <MessageArea channel={channel} last_id={lastId} />
                <TypingIndicator channel={channel} />
                <JumpToBottom channel={channel} />
                <MessageBox channel={channel} />-->
        </div>
    </ErrorBoundary>
    {#if !isTouchscreenDevice && layout.getSectionState(SIDEBAR_MEMBERS, true)}
        <RightSidebar />
    {/if}
</div>

<style>
    div.ChannelMain {
        flex-grow: 1;
        display: flex;
        min-height: 0;
        overflow: hidden;
        flex-direction: row;
    }

    div.ChannelContent {
        flex-grow: 1;
        display: flex;
        overflow: hidden;
        flex-direction: column;
    }
</style>