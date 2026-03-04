<script lang="ts">
    import { internalSubscribe } from "$lib/InternalEmitter";
    import { reaction } from "mobx";
    import type { Channel } from "stoat.js";
    import MessageArea from "../messaging/MessageArea.svelte";
    import MessageBox from "../messaging/MessageBox.svelte";
    import JumpToBottom from "../messaging/bars/JumpToBottom.svelte";
    import ChannelLayout from "./ChannelLayout.svelte";
    import { useClient } from "$lib/controllers/ClientController";

    const client = useClient();
    export let channel: Channel,
        message: string | null = null;

    let lastId: string | undefined;
    internalSubscribe("NewMessages", "hide", () => (lastId = undefined));
    internalSubscribe("NewMessages", "mark", (id) => {
        if (typeof id == "string") lastId = id;
    });
    $: {
        let unreads = client.channelUnreads.for(channel);
        lastId = unreads.lastMessageId;
        const checkUnread = () => channel.ack();
        checkUnread();
        reaction(
            () => channel.lastMessageId,
            checkUnread,
        );
    }
</script>

<ChannelLayout {channel}>
    <MessageArea {channel} {lastId} messageId={message} />
    <JumpToBottom {channel} />
    <MessageBox {channel} />
</ChannelLayout>
