<script lang="ts">
    import type { Channel } from "stoat.js";
    import GenericSidebarBase from "../GenericSidebarBase.svelte";
    import MemberList from "./MemberList.svelte";
    import { fetchMembers } from "$lib/MemberList";
    import { useClient } from '$lib/components/client/ClientContext.svelte';

    interface Props {
        channel: Channel;
    }

    let { channel }: Props = $props();
    const FETCHED = new Set;
    const client = useClient();
    let entries = $derived(fetchMembers(
            channel,
            async () => {
                await channel?.server?.syncMembers(false);
                return client.serverMembers.filter((members) => members.id.server == channel?.serverId);
            },
        ));
    let server_id = $derived(channel?.serverId);
    $effect(() => {
        if (server_id && client.ready() && !FETCHED.has(server_id)) {
            FETCHED.add(server_id);
            channel?.server?.syncMembers(false).catch(()=>FETCHED.delete(server_id));
        }
    });
</script>

{#if channel}
    <GenericSidebarBase data-scroll-offset="with_padding">
        <MemberList entries={$entries} {channel} />
    </GenericSidebarBase>
{/if}
