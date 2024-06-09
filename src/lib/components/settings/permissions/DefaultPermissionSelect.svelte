<script lang="ts">
    import { type Channel, Server } from "revolt.js";
    import Long from "long";
    import { Checkbox } from "fluent-svelte";
    import { useClient } from "$lib/controllers/ClientController";
    import PermissionEntry from "./PermissionEntry.svelte";
    import { Permission } from "revolt.js/lib/esm/permissions/definitions";

    export let id: keyof typeof Permission,
        target: Channel | Server,
        permission: number,
        value: number,
        onChange: (value: number) => void;
    
    let checked = Long.fromNumber(value).and(permission).eq(permission);
    let lastChecked = checked;
    let disabled = target instanceof Server ? !target.member?.hasPermission(target, "ManageRole")  : target.ownerId != useClient().user?.id;
    $: if (lastChecked != checked) {
        console.log(Long.fromNumber(value, false).xor(permission).toNumber());
        lastChecked = checked;
        onChange(Long.fromNumber(value, false).xor(permission).toNumber());
    }
</script>

<PermissionEntry {id}>
    <Checkbox {disabled} value={permission} bind:checked />
</PermissionEntry>