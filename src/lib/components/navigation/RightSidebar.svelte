<script>
    import { SIDEBAR_MEMBERS } from "$lib/components/state/stores/Layout";
    import GroupMemberSidebar from "./right/GroupMemberSidebar.svelte";
    import ServerMemberSidebar from "./right/ServerMemberSidebar.svelte";
    import { useClient } from "../client/ClientContext.svelte";
    import { page } from "$app/state";
    import { useState } from "../state/StateContext.svelte";

   /** @type {{snap?: boolean}} */
   let { snap = false } = $props();
    let client = useClient();
    let layout = useState().layout;
    let server_id = $derived(page.params.server);
    let server = $derived(server_id ? client.servers.get(server_id) : undefined);
    let openRight = $derived(layout.isSectionOpen(SIDEBAR_MEMBERS));
    
    let channel_id = $derived(page.params.channel);
    let channel = $derived(channel_id ? client.channels.get(channel_id): undefined);
</script>

{#if openRight || snap}
   {#if server}
        <ServerMemberSidebar {channel} />
    {:else if channel}
        <GroupMemberSidebar {channel} />
    {/if}
{/if}
