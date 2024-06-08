<script lang="ts">
    import type { Channel } from "revolt.js";
    import { _ } from "svelte-i18n";

    export let channel: Channel | undefined = undefined, prefix = false;
</script>

{#if channel}
    {#if channel.type == "SavedMessages"}
        {$_('app.navigation.tabs.saved')}
    {:else if channel.type == "DirectMessage"}
        {prefix ? "@" : ""}{channel.recipient?.username}
    {:else if channel.type == "TextChannel" && prefix}
        {`#${channel.name}`}
    {:else}
        {channel.name}
    {/if}
{/if}