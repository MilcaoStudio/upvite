<script>
   import { run } from 'svelte/legacy';

    import { page } from "$app/stores";
    import { state } from "$lib/State";
    import { useClient } from "$lib/controllers/ClientController";
    import { SIDEBAR_MEMBERS } from "$lib/stores/Layout";
    import { autorun } from "mobx";
    import GroupMemberSidebar from "./right/GroupMemberSidebar.svelte";
    import ServerMemberSidebar from "./right/ServerMemberSidebar.svelte";

   /** @type {{snap?: boolean}} */
   let { snap = false } = $props();
    let client = useClient();
    let server_id = $derived($page.params.server);
    let server = $derived(server_id ? client.servers.get(server_id) : undefined);
    let openRight = $state(state.layout.getSectionState(SIDEBAR_MEMBERS, true));
    run(() => {
      autorun(()=> openRight = state.layout.getSectionState(SIDEBAR_MEMBERS, true));
   });
    let channel_id = $derived($page.params.channel);
    let channel = $derived(channel_id ? client.channels.get(channel_id): undefined);
</script>

{#if openRight || snap}
   {#if server}
        <ServerMemberSidebar {channel} />
    {:else if channel}
        <GroupMemberSidebar {channel} />
    {/if}
{/if}
