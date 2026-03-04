<script lang="ts">
    import { Channel, Permission, type API, type Server } from "stoat.js";
    import DefaultPermissionSelect from "./DefaultPermissionSelect.svelte";
    import PermissionSelect from "./PermissionSelect.svelte";

    interface Props {
        value: bigint | {a: bigint, d: bigint};
        onChange: (value: bigint | {a: bigint, d: bigint}) => void;
        target: Channel | Server;
        items?: Set<keyof typeof Permission> | null;
    }

    let {
        value,
        onChange,
        target,
        items = null
    }: Props = $props();
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
    let selections = $derived((
        Object.keys(Permission) as (keyof typeof Permission)[]
    ).filter((key) => !serverPermissions.has(key) && (!items || items.has(key))));
</script>

{#if target}
    {#if typeof value == "bigint"}
        {#each selections as select (select)}
            <DefaultPermissionSelect
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
