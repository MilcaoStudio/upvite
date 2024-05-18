<script lang="ts">
    import Overview from "$lib/components/settings/channel/Overview.svelte";
    import Permissions from "$lib/components/settings/channel/Permissions.svelte";
    import Settings from "$lib/components/settings/common/Settings.svelte";
    import ScrollerContent from "$lib/components/settings/common/scrollerContent.svelte";
    import { useClient } from "$lib/controllers/ClientController";
    import { t } from "svelte-i18n";

    export let data;
    let client = useClient();
    $: channel = client.channels.get(data.channel);
    $: server = client.servers.get(data.server);
    $: tab = data.tab;
</script>

{#if channel}
    <Settings
        {tab}
        pages={{ overview: Overview, permissions: Permissions }}
        locale="channel_pages"
        title={channel.name}
        {channel}
    />
{/if}
