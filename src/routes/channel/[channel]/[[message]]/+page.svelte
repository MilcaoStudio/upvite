<script lang="ts">
    import { goto } from "$app/navigation";
    import { state } from "$lib/State";
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import TextChannel from "$lib/components/channels/TextChannel.svelte";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import SidebarBase from "$lib/components/navigation/SidebarBase.svelte";
    import HomeSidebar from "$lib/components/navigation/left/HomeSidebar.svelte";
    import ServerListSidebar from "$lib/components/navigation/left/ServerListSidebar.svelte";
    import GroupMemberSidebar from "$lib/components/navigation/right/GroupMemberSidebar.svelte";
    import { useClient } from "$lib/controllers/ClientController";
    import { SIDEBAR_CHANNELS, Viewport } from "$lib/stores/Layout";
    import { autorun } from "mobx";
    const client = useClient();
    export let data;
    let { channel_id, message_id } = data;

    let channel = client.channels.get(channel_id);
    if (!channel) {
        goto(state.layout.getLastHomePath());
    }
    let openLeft = state.layout.getSectionState(SIDEBAR_CHANNELS, state.layout.getViewport() != Viewport.SMALL);
    $: autorun(()=>{
        openLeft = state.layout.getSectionState(SIDEBAR_CHANNELS, state.layout.getViewport() != Viewport.SMALL);
    });
    let openRight = state.layout.getViewport() != Viewport.SMALL;
</script>

<UprisingApp>
    <SidebarBase slot="left">
        <ServerListSidebar />
        {#if openLeft}
            <HomeSidebar />
        {/if}
    </SidebarBase>
    {#if channel}
        <TextChannel {channel} message={message_id} />
    {:else}
        <Preloader type="ring" />
    {/if}
    <svelte:fragment slot="right">
        {#if openRight}
            <GroupMemberSidebar {channel} />
        {/if}
    </svelte:fragment>
</UprisingApp>

