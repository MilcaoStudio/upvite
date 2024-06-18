<script lang="ts">
    import type { Channel } from "revolt.js";
    import ChannelLayout from "../channels/ChannelLayout.svelte";
    import JumpToBottom from "../messaging/bars/JumpToBottom.svelte";
    import MockMessageArea from "./MockMessageArea.svelte";
    import MessageBox from "../messaging/MessageBox.svelte";
    
    export let channel: Channel;
</script>

<ChannelLayout {channel}>
    <MockMessageArea {channel} />
    <JumpToBottom {channel} />
    <MessageBox {channel} mock />
</ChannelLayout>