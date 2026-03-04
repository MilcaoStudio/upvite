<script lang="ts">
    import { run } from 'svelte/legacy';

    import { internalSubscribe } from "$lib/InternalEmitter";
    import { reaction } from "mobx";
    import type { Channel } from "stoat.js";
    import MessageArea from "../messaging/MessageArea.svelte";
    import MessageBox from "../messaging/MessageBox.svelte";
    import JumpToBottom from "../messaging/bars/JumpToBottom.svelte";
    import ChannelLayout from "./ChannelLayout.svelte";
    import { useClient } from "$lib/controllers/ClientController";

    const client = useClient();
    interface Props {
        channel: Channel;
        message?: string | null;
    }

    let { channel, message = null }: Props = $props();

    let lastId: string | undefined = $state();
    internalSubscribe("NewMessages", "hide", () => (lastId = undefined));
    internalSubscribe("NewMessages", "mark", (id) => {
        if (typeof id == "string") lastId = id;
    });
    run(() => {
        let unreads = client.channelUnreads.for(channel);
        lastId = unreads.lastMessageId;
        const checkUnread = () => channel.ack();
        checkUnread();
        reaction(
            () => channel.lastMessageId,
            checkUnread,
        );
    });
</script>

<ChannelLayout {channel}>
    <MessageArea {channel} {lastId} messageId={message} />
    <JumpToBottom {channel} />
    <MessageBox {channel} />
</ChannelLayout>
