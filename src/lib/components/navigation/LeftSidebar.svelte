<script>
    import { SIDEBAR_CHANNELS, Viewport } from "$lib/components/state/stores/Layout";
    import SidebarBase from "./SidebarBase.svelte";
    import HomeSidebar from "./left/HomeSidebar.svelte";
    import ServerListSidebar from "./left/ServerListSidebar.svelte";
    import ServerSidebar from "./left/ServerSidebar.svelte";
    import { page } from "$app/state";
    import { useClient } from "../client/ClientContext.svelte";
    import { useState } from "../state/StateContext.svelte";

    let { snap = false } = $props();
    //let demo = $derived(page.data.demo || false);
    let channel_id = $derived(page.params.channel);
    let server_id = $derived(page.params.server);
    console.debug("<Page> params", page.data);
    //let client = $derived(demo ? useMockClient() : useClient());
    //let channel = $derived(demo ? servers[0].channels[0] : channel_id ? client.channels.get(channel_id) : undefined);
    //let server = $derived(demo ? servers[0] : server_id ? client.servers.get(server_id) : undefined);
    let client = useClient();
    let channel = $derived(client.channels.get(channel_id || ""));
    let server = $derived(client.servers.get(server_id || ""));
    let layout = useState().layout;
    $effect(()=>{
        document.title = server
        ? `#${channel?.name ?? ""} - ${server.name} | Uprising`
        : channel
          ? `#${channel.name} | Uprising`
          : `Uprising`
    });
    let openLeft = $derived(layout.isSectionOpen(SIDEBAR_CHANNELS,) || layout.getViewport() != Viewport.SMALL,);
</script>

<SidebarBase>
    <ServerListSidebar {server_id} />
    {#if openLeft || snap}
        {#if server}
            <ServerSidebar {client} {server} {channel} />
        {:else}
            <HomeSidebar {channel} />
        {/if}
    {/if}
</SidebarBase>
