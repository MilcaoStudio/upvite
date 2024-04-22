<script lang="ts">
    import type { Channel } from "revolt.js";
    //import VoiceActions from "./actions/VoiceActions.svelte";

    export const channel: Channel | undefined = undefined;
</script>

<div class="Container">
    <!--TODO: Actions-->
    <!--
    {#if channel.channel_type == "VoiceChannel"}
        
        <VoiceActions {channel} />
    {/if}-->
</div>

<style>
    div.Container {
        display: flex;
        gap: 16px;
    }
</style>