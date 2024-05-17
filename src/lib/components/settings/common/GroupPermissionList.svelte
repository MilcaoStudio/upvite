<script lang="ts">
    import { Channel, Permission, type API, type Server } from "revolt.js";
    import GroupPermissionSelect from "./GroupPermissionSelect.svelte";

    export let value: number,
        onChange: (value: number) => void,
        target: Channel | Server,
        items: (keyof typeof Permission)[];
    $: selections = (
        Object.keys(Permission) as (keyof typeof Permission)[]
    ).filter(
        (key) =>
            ![
                "GrantAllSafe",
                "ReadMessageHistory",
                "Speak",
                "Video",
                "MuteMembers",
                "DeafenMembers",
                "MoveMembers",
                "ManageWebhooks",
            ].includes(key) &&
            (!items || items.includes(key)),
    );
</script>

{#if target instanceof Channel}
    {#each selections as select (select)}
        <GroupPermissionSelect
            id={select}
            permission={Permission[select]}
            {onChange}
            {value}
            {target}
        />
    {/each}
{/if}
