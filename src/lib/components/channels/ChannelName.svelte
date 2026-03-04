<script lang="ts">
    import type { Channel } from "stoat.js";
    import { _ } from "svelte-i18n";

    interface Props {
        channel?: Channel | undefined;
        prefix?: boolean;
    }

    let { channel = undefined, prefix = false }: Props = $props();
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