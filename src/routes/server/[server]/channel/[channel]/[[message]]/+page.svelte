<script lang="ts">
    import { goto } from "$app/navigation";
    import { state } from "$lib/State";
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import TextChannel from "$lib/components/channels/TextChannel.svelte"
    import { useClient } from "$lib/controllers/ClientController";
    import type { LayoutData } from "./$types";
    import { isTouchscreenDevice } from "$lib";
    import { SIDEBAR_CHANNELS, Viewport } from "$lib/stores/Layout";
    import SidebarBase from "$lib/components/navigation/SidebarBase.svelte";
    import ServerSidebar from "$lib/components/navigation/left/ServerSidebar.svelte";
    import ServerListSidebar from "$lib/components/navigation/left/ServerListSidebar.svelte";
    import { autorun } from "mobx";
    import ServerMemberSidebar from "$lib/components/navigation/right/ServerMemberSidebar.svelte";
    const client = useClient();

    export let data: LayoutData;
    
    
    $: id = data.channel;
    $: server_id = data.server;
    $: message = data.message;
    $: server = client.servers.get(server_id);

    if (!client.channels.exists(id)) {
        if (server_id) {
            if (server && server.channel_ids.length > 0) {
                let target_id = server.channel_ids[0];
                const last_id = state.layout.getLastOpened(server_id);
                if (last_id) {
                    if (client.channels.has(last_id)) {
                        target_id = last_id;
                    }
                }

                goto(`/server/${server_id}/channel/${target_id}`)
            }
            if (!server) {
                goto("/");
            }
        }
    }

    $: channel = client.channels.get(id);
    $: document.title = `#${channel?.name ?? ""} - ${server?.name ?? ""} | Uprising`
    let openLeft = false;
    $: autorun(()=>{
        openLeft = isTouchscreenDevice || state.layout.getSectionState(SIDEBAR_CHANNELS, true);
    });
    let openRight = state.layout.getViewport() != Viewport.SMALL;
</script>

<UprisingApp>
    <SidebarBase slot="left">
        <ServerListSidebar />
        {#key channel}
            {#if openLeft && server}
                <ServerSidebar {server} {channel} />
            {/if}
        {/key}
    </SidebarBase>
    {#key channel}
        {#if channel}
            <TextChannel {channel} {message} />
        {/if}
    {/key}
    <svelte:fragment slot="right">
        {#if openRight}
            <ServerMemberSidebar {channel} />
        {/if}
    </svelte:fragment>
</UprisingApp>

