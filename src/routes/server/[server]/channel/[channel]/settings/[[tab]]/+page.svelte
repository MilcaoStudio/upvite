<script lang="ts">
    import Overview from "$lib/components/settings/channel/Overview.svelte";
    import Permissions from "$lib/components/settings/channel/Permissions.svelte";
    import Settings from "$lib/components/settings/common/Settings.svelte";
    import ScrollerContent from "$lib/components/settings/common/scrollerContent.svelte";
    import { useClient } from "$lib/controllers/ClientController";
    import { t } from "svelte-i18n";

    interface Props {
        data: any;
    }

    let { data }: Props = $props();
    let client = useClient();
    let channel = $derived(client.channels.get(data.channel));
    let server = $derived(client.servers.get(data.server));
    let tab = $derived(data.tab);
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
