<script>
    import { page } from "$app/stores";
    import { useClient } from "$lib/controllers/ClientController";
    import GroupMemberSidebar from "./right/GroupMemberSidebar.svelte";
    import ServerMemberSidebar from "./right/ServerMemberSidebar.svelte";

    let client = useClient();
    $: server_id = $page.params.server;
    $: server = client.servers.get(server_id);
    let openRight = true;
    $: channel_id = $page.params.channel;
    $: channel = client.channels.get(channel_id);
</script>

{#if openRight}
   {#if server}
        <ServerMemberSidebar {channel} />
    {:else if channel}
        <GroupMemberSidebar {channel} />
    {/if}
{/if}
