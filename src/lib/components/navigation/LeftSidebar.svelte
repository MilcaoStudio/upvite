<script>
    import { run } from 'svelte/legacy';

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

    /** @type {{snap?: boolean}} */
    let { snap = false } = $props();
    let demo = $derived($page.data.demo || false);
    let channel_id = $derived($page.params.channel);
    let server_id = $derived($page.params.server);
    console.debug("<Page> params", $page.data);
    let client = $derived(demo ? useMockClient() : useClient());
    let channel = $derived(demo ? servers[0].channels[0] : channel_id ? client.channels.get(channel_id) : undefined);
    let server = $derived(demo ? servers[0] : server_id ? client.servers.get(server_id) : undefined);
    let document.title = $derived(server
        ? `#${channel?.name ?? ""} - ${server.name} | Uprising`
        : channel
          ? `#${channel.name} | Uprising`
          : `Uprising`);
    let openLeft = $state(state.layout.getSectionState(
        SIDEBAR_CHANNELS,
        true,
    ));
    run(() => {
        autorun(() => {
            openLeft = state.layout.getSectionState(
                SIDEBAR_CHANNELS,
                true,
            );
        });
    });
</script>

<SidebarBase>
    <ServerListSidebar {server_id} />
    {#if openLeft || snap}
        {#if server}
            {#key channel}
                <ServerSidebar {client} {server} {channel} />
            {/key}
        {:else}
            <HomeSidebar />
        {/if}
    {/if}
</SidebarBase>
