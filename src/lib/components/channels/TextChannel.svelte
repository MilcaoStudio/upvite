<script lang="ts">
    import { internalSubscribe } from "$lib/InternalEmitter";
    import { reaction } from "mobx";
    import type { Channel } from "revolt.js";
    import ChannelHeader from "./ChannelHeader.svelte";
    import NewMessages from "../messaging/bars/NewMessages.svelte";
    import MessageArea from "../messaging/MessageArea.svelte";
    import MessageBox from "../messaging/MessageBox.svelte";
    import JumpToBottom from "../messaging/bars/JumpToBottom.svelte";

    export let channel: Channel, message: string | null = null;

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


<div class="ChannelMain" data-component="channel">
    <ChannelHeader {channel} />
    <!--<ErrorBoundary section="renderer">-->
        <div class="ChannelContent">
            <NewMessages {channel} {lastId} />
            <MessageArea {channel} {lastId} messageId={message} />
            <JumpToBottom {channel} />
            <MessageBox {channel} />
        </div>
    <!--</ErrorBoundary>-->
</div>

<style>
    div.ChannelMain {
        flex-grow: 1;
        display: flex;
        min-height: 0;
        overflow: hidden;
        flex-direction: row;
        position: relative;
    }

    div.ChannelContent {
        flex-grow: 1;
        display: flex;
        overflow: hidden;
        flex-direction: column;
    }
</style>