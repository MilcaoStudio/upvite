<script lang="ts">
    import type { Channel } from "stoat.js";
    import GenericSidebarBase from "../GenericSidebarBase.svelte";
    import MemberList from "./MemberList.svelte";
    import { fetchRecipients } from "$lib/MemberList";
    import GroupList from "./GroupList.svelte";

    export let channel: Channel | undefined = undefined;
    let entries = fetchRecipients(() => channel!.recipients)
</script>

{#if channel}
    <GenericSidebarBase data-scroll-offset="with_padding">
        <GroupList entries={$entries} {channel} />
    </GenericSidebarBase>
{/if}