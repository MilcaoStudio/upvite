<script lang="ts">
    import type { UserListGroup } from "$lib/MemberList";
    import type { Channel } from "stoat.js";
    import { t } from "svelte-i18n";
    import MemberItem from "./MemberItem.svelte";

    export let entries: UserListGroup[], channel: Channel;
</script>

{#each entries as entry, index}
    <div class="CategoryList" class:first={!index}>
        {#if entry.type == "online"}
            {$t("app.status.online")}
        {:else}
            {$t("app.status.offline")}
        {/if}
        
    </div>
    {#each entry.users as user (user.id)}
        <div style:padding-bottom="8px">
            <MemberItem user={user} context={channel} />
        </div>
    {/each}
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
