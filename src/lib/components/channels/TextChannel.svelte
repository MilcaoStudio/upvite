<script lang="ts">
    import { internalSubscribe } from "$lib/InternalEmitter";
    import { state } from "$lib/State";
    import { reaction } from "mobx";
    import type { Channel } from "revolt.js";

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

Bienvenido al canal {channel.name}