<script lang="ts">
    import { type Permission, type Channel, Server } from "stoat.js";
    import Long from "long";
    import { Checkbox } from "fluent-svelte";
    import { useClient } from "$lib/controllers/ClientController";
    import PermissionEntry from "./PermissionEntry.svelte";

    export let id: keyof typeof Permission,
        target: Channel | Server,
        permission: bigint,
        value: bigint,
        onChange: (value: bigint) => void;
    
    let checked = Long.fromBigInt(value).and(permission).eq(permission);
    let lastChecked = checked;
    let disabled = target instanceof Server ? !target.member?.hasPermission(target, "ManageRole")  : target.ownerId != useClient().user?.id;
    $: if (lastChecked != checked) {
        console.log(Long.fromBigInt(value, false).xor(permission).toBigInt());
        lastChecked = checked;
        onChange(Long.fromBigInt(value, false).xor(permission).toBigInt());
    }
</script>

<PermissionEntry {id}>
    <Checkbox {disabled} value={permission} bind:checked />
</PermissionEntry>