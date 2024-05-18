<script lang="ts">
    import { Channel, Permission, type API, type Server } from "revolt.js";
    import GroupPermissionSelect from "./GroupPermissionSelect.svelte";
    import PermissionSelect from "./PermissionSelect.svelte";

    export let value: number | API.OverrideField,
        onChange: (value: number | API.OverrideField) => void,
        target: Channel | Server,
        items: Set<keyof typeof Permission>;
    const serverPermissions = new Set([
        "GrantAllSafe",
        "ReadMessageHistory",
        "Speak",
        "Video",
        "MuteMembers",
        "DeafenMembers",
        "MoveMembers",
        "ManageWebhooks",
    ]);
    $: selections = (
        Object.keys(Permission) as (keyof typeof Permission)[]
    ).filter((key) => !serverPermissions.has(key) && (!items || items.has(key)));
</script>

{#if target instanceof Channel}
    {#if typeof value == "number"}
        {#each selections as select (select)}
            <GroupPermissionSelect
                id={select}
                permission={Permission[select]}
                {onChange}
                {value}
                {target}
            />
        {/each}
    {:else}
        {#each selections as select (select)}
            <PermissionSelect
                id={select}
                permission={Permission[select]}
                {onChange}
                {value}
                {target}
            />
        {/each}
    {/if}
{/if}
