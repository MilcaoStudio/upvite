<script>
    import { state } from "$lib/State";
    import { SIDEBAR_CHANNELS } from "$lib/stores/Layout";
    import { autorun } from "mobx";
    import SidebarBase from "./SidebarBase.svelte";
    import HomeSidebar from "./left/HomeSidebar.svelte";
    import ServerListSidebar from "./left/ServerListSidebar.svelte";
    import ServerSidebar from "./left/ServerSidebar.svelte";
    import { page } from "$app/stores";
    import { useClient } from "$lib/controllers/ClientController";
    import { servers, useClient as useMockClient } from "../mock/MockClient";

    export let snap = false;
    $: demo = $page.data.demo || false;
    $: channel_id = $page.params.channel;
    $: server_id = $page.params.server;
    console.log($page.data);
    $: client = demo ? useMockClient() : useClient();
    $: channel = demo ? servers[0].channels[0] : channel_id ? client.channels.get(channel_id) : undefined;
    $: server = demo ? servers[0] : server_id ? client.servers.get(server_id) : undefined;
    $: document.title = server
        ? `#${channel?.name ?? ""} - ${server.name} | Uprising`
        : channel
          ? `#${channel.name} | Uprising`
          : `Uprising`;
    let openLeft = state.layout.getSectionState(
        SIDEBAR_CHANNELS,
        true,
    );
    $: autorun(() => {
        openLeft = state.layout.getSectionState(
            SIDEBAR_CHANNELS,
            true,
        );
    });
</script>

<SidebarBase>
    <ServerListSidebar {server_id} {client} />
    {#if openLeft || snap}
        {#if server && channel}
            {#key channel}
                <ServerSidebar {client} {server} {channel} />
            {/key}
        {:else}
            <HomeSidebar />
        {/if}
    {/if}
</SidebarBase>
