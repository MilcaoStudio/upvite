<script lang="ts">
    import type { Channel } from "stoat.js";
    import ChannelHeader from "./ChannelHeader.svelte";
    import NewMessages from "../messaging/bars/NewMessages.svelte";
    interface Props {
        channel: Channel;
        lastId?: string | undefined;
        children?: import('svelte').Snippet;
    }

    let { channel, lastId = undefined, children }: Props = $props();
</script>
<div class="ChannelMain" data-component="channel">
    <ChannelHeader {channel} />
        <div class="ChannelContent">
            <NewMessages {channel} {lastId} />
            {@render children?.()}
        </div>
</div>

<style>
    div.ChannelMain {
        flex-grow: 1;
        display: flex;
        min-height: 0;
        overflow: hidden;
        flex-direction: column;
        position: relative;
    }

    div.ChannelContent {
        flex-grow: 1;
        display: flex;
        overflow: hidden;
        flex-direction: column;
    }
</style>