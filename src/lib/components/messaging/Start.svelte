<script lang="ts">
    import type { Channel } from "revolt.js";
    import ChannelName from "../channels/ChannelName.svelte";
    import { _ } from "svelte-i18n";

    export let channel: Channel;
</script>

<div class="Start">
    <h1><ChannelName {channel} /></h1>
    <h4>{$_('app.main.channel.start.group')}</h4>
</div>

<style>
div.Start {
    margin: 18px 16px 10px 16px;
}

div.Start h1 {
    font-size: 23px;
    margin: 0 0 8px 0;
}

div.Start h4 {
    font-weight: 400;
    margin: 0;
    font-size: 14px;
}
</style>