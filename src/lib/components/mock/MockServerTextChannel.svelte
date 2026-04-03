<script lang="ts">
    import type { Channel } from "stoat.js";
    import ChannelLayout from "../channels/ChannelLayout.svelte";
    import JumpToBottom from "../messaging/bars/JumpToBottom.svelte";
    import MessageBox from "../messaging/MessageBox.svelte";
    
    interface Props {
        channel: Channel;
    }

    let { channel }: Props = $props();
</script>

<ChannelLayout {channel}>
    <JumpToBottom {channel} />
    <MessageBox {channel} mock />
</ChannelLayout>