<script lang="ts">
    import type { Channel } from "revolt.js";
    import { _ } from "svelte-i18n";

    export let channel: Channel | undefined = undefined, prefix = false;
</script>

{#if channel}
    {#if channel.channel_type == "SavedMessages"}
        {$_('app.navigation.tabs.saved')}
    {:else if channel.channel_type == "DirectMessage"}
        {prefix ? "@" : ""}{channel.recipient?.username}
    {:else if channel.channel_type == "TextChannel" && prefix}
        {`#${channel.name}`}
    {:else}
        {channel.name}
    {/if}
{/if}