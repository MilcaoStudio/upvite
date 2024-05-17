<script>
    import { page } from "$app/stores";
    import { state } from "$lib/State";
    import { useClient } from "$lib/controllers/ClientController";
    import { SIDEBAR_MEMBERS } from "$lib/stores/Layout";
    import { autorun } from "mobx";
    import GroupMemberSidebar from "./right/GroupMemberSidebar.svelte";
    import ServerMemberSidebar from "./right/ServerMemberSidebar.svelte";

    export let snap = false;
    let client = useClient();
    $: server_id = $page.params.server;
    $: server = client.servers.get(server_id);
    let openRight = state.layout.getSectionState(SIDEBAR_MEMBERS, true);
    $: autorun(()=> openRight = state.layout.getSectionState(SIDEBAR_MEMBERS, true));
    $: channel_id = $page.params.channel;
    $: channel = client.channels.get(channel_id);
</script>

{#if openRight || snap}
   {#if server}
        <ServerMemberSidebar {channel} />
    {:else if channel}
        <GroupMemberSidebar {channel} />
    {/if}
{/if}
