<script lang="ts">
    import type { Channel } from "revolt.js";
    import GenericSidebarBase from "../GenericSidebarBase.svelte";
    import MemberList from "./MemberList.svelte";
    import { fetchMembers } from "$lib/MemberList";

    export let channel: Channel | undefined = undefined;
    let entries = fetchMembers(
            channel!,
            () => channel!.recipient_ids!,
            false,
        );
</script>

{#if channel}
    <GenericSidebarBase data-scroll-offset="with_padding">
        <MemberList entries={$entries} {channel} />
    </GenericSidebarBase>
{/if}