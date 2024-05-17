<script lang="ts">
    import type { MemberListGroup } from "$lib/MemberList";
    import type { Channel } from "revolt.js";
    import { t } from "svelte-i18n";
    import MemberItem from "./MemberItem.svelte";

    export let entries: MemberListGroup[], channel: Channel;
</script>

{#each entries as entry, index}
    <div class="CategoryList" class:first={!index}>
        {#if entry.type == "role"}
            {entry.name}
        {:else if entry.type == "online"}
            {$t("app.status.online")}
        {:else}
            {$t("app.status.offline")}
        {/if}
        {#if entry.type != "no_offline"}
            {" – "}
            {entry.users.length}
        {/if}
    </div>
    {#if entry.type == "no_offline"}
        Offline users have temporarily been disabled for larger servers
    {:else}
    {#each entry.users as user (user._id)}
        <div style:padding-bottom="8px">
            <MemberItem item={user} context={channel} />
        </div>
    {/each}
    {/if}
    
{/each}

<style>
    .CategoryList {
        opacity: 0.8;
        font-size: 0.8em;
        font-weight: 600;
        user-select: none;

        padding: 4px 14px;
        padding-top: 12px;

        color: var(--secondary-foreground);
        background: var(--secondary-background);
    }
    .CategoryList.first {
        padding-top: 16px;
    }
</style>
