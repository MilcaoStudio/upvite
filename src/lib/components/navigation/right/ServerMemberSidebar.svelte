<script lang="ts">
    import type { Channel } from "revolt.js";
    import GenericSidebarBase from "../GenericSidebarBase.svelte";
    import MemberList from "./MemberList.svelte";
    import { shouldSkipOffline, fetchMembers } from "$lib/MemberList";
    import { useSession } from "$lib/controllers/ClientController";

    export let channel: Channel | undefined = undefined;
    const FETCHED = new Set;
    let session = useSession();
    let entries = fetchMembers(
            channel!,
            () => [...session!.client!.members.keys()],
            true,
        );
    $: {
        let server_id = channel?.server_id;
        if (server_id && session?.state == "Online" && !FETCHED.has(server_id)) {
            FETCHED.add(server_id);
            channel?.server?.syncMembers(false).catch(()=>FETCHED.delete(server_id));
        }
    }
</script>

{#if channel}
    <GenericSidebarBase data-scroll-offset="with_padding">
        <MemberList entries={$entries} {channel} />
    </GenericSidebarBase>
{/if}
