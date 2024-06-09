<script lang="ts">
    import Button from "$lib/components/atoms/Button.svelte";
import Item from "$lib/components/atoms/input/Item.svelte";
import type { Server } from "revolt.js";
    import BxLock from "svelte-boxicons/BxLock.svelte";
    import { t } from "svelte-i18n";


    export let server: Server,
        showDefault = false,
        selected: string,
        rank: number,
        onSelect: (value: string) => void,
        onCreateRole:
            | ((callback: (role_id: string) => void) => void)
            | undefined = undefined;
    $: if (server.roles) {
        if (selected != "default" && !server.roles.get(selected)) {
            onSelect("default");
        }
    }

    let roles = server.orderedRoles;
</script>

<div class="RoleList" role="list">
    {#each roles as role (role.id)}
        <Item selected={selected == role.id} onclick={()=>onSelect(role.id)} backgroundSelected={role.colour ?? "var(--hover)"} role="item">
            <span class="rank">{role.rank ?? 0}</span>
            <strong>{role.name}</strong>
            {#if rank && (role.rank ?? 0) <= rank}
                <BxLock size={16} />
            {/if}
        </Item>
    {/each}
    {#if showDefault}
        <Item selected={selected == "default"} onclick={()=>onSelect("default")}>
            <strong style:padding-left="24px">@everyone</strong></Item>
    {/if}
    {#if onCreateRole}
       <Button palette="plain-secondary" onClick={()=>onCreateRole(onSelect)}>{$t("app.settings.permissions.create_role")}</Button> 
    {/if}
</div>

<style>
    .RoleList {
        gap: 4px;
        display: flex;
        flex-direction: column;
    }

    .rank {
        font-size: 0.8em;
        color: var(--tertiary-foreground);
        opacity: 0;
    }
    
    .RoleList:hover .rank {
        opacity: 1;
    }
</style>
