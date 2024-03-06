<script lang="ts">
    import { internalSubscribe } from "$lib/InternalEmitter";
    import { state } from "$lib/State";
    import { reaction } from "mobx";
    import type { Channel } from "revolt.js";
    import ChannelHeader from "./ChannelHeader.svelte";
    import { ErrorBoundary } from "$lib/error/errorBoundary";
    import NewMessages from "../messaging/bars/NewMessages.svelte";
    import { isTouchscreenDevice } from "$lib";
    import { SIDEBAR_MEMBERS } from "$lib/stores/Layout";
    import RightSidebar from "../navigation/RightSidebar.svelte";
    import MessageArea from "../messaging/MessageArea.svelte";
    import MessageBox from "../messaging/MessageBox.svelte";
    import JumpToBottom from "../messaging/bars/JumpToBottom.svelte";

    export let channel: Channel, message: string | null = null;
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
    <!--<ErrorBoundary section="renderer">-->
        <div class="ChannelContent">
            <NewMessages {channel} {lastId} />
            <MessageArea {channel} {lastId} messageId={message} />
            <JumpToBottom {channel} />
            <MessageBox {channel} />
            <!--<VoiceHeader id={channel._id} />
                <NewMessages channel={channel} {lastId} />
                <MessageArea channel={channel} {lastId} messageId={message} />
                <TypingIndicator channel={channel} />
                <JumpToBottom channel={channel} />
                <MessageBox channel={channel} />-->
        </div>
    <!--</ErrorBoundary>-->
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