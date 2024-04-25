<script>
    import { state } from "$lib/State";
    import { SIDEBAR_CHANNELS, Viewport } from "$lib/stores/Layout";
    import { autorun } from "mobx";
    import SidebarBase from "./SidebarBase.svelte";
    import HomeSidebar from "./left/HomeSidebar.svelte";
    import ServerListSidebar from "./left/ServerListSidebar.svelte";
    import ServerSidebar from "./left/ServerSidebar.svelte";
    import { page } from "$app/stores";
    import { useClient } from "$lib/controllers/ClientController";

    $: channel_id = $page.params.channel;
    $: server_id = $page.params.server;
    let client = useClient();
    $: channel = channel_id ? client.channels.get(channel_id) : undefined;
    $: server = server_id ? client.servers.get(server_id) : undefined;
    $: document.title = server
        ? `#${channel?.name ?? ""} - ${server.name} | Uprising`
        : channel
          ? `#${channel.name} | Uprising`
          : `Uprising`;
    let openLeft = state.layout.getSectionState(
        SIDEBAR_CHANNELS,
        state.layout.getViewport() != Viewport.SMALL,
    );
    $: autorun(() => {
        openLeft = state.layout.getSectionState(
            SIDEBAR_CHANNELS,
            state.layout.getViewport() != Viewport.SMALL,
        );
    });
</script>

<SidebarBase>
    <ServerListSidebar />
    {#if openLeft}
        {#if server && channel}
            {#key channel}
                <ServerSidebar {server} {channel} />
            {/key}
        {:else}
            <HomeSidebar />
        {/if}
    {/if}
</SidebarBase>
