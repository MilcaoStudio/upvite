<script lang="ts">
    import { type Permission, type Channel, Server } from "stoat.js";
    import Long from "long";
    import { Checkbox } from "fluent-svelte";
    import PermissionEntry from "./PermissionEntry.svelte";
    import { useClient } from "$lib/components/client/ClientContext.svelte";

    interface Props {
        id: keyof typeof Permission;
        target: Channel | Server;
        permission: bigint;
        value: bigint;
        onChange: (value: bigint) => void;
    }

    let {
        id,
        target,
        permission,
        value,
        onChange
    }: Props = $props();
    
    let checked = $derived(Long.fromBigInt(value).and(permission).eq(permission));
    let disabled = $derived(target instanceof Server ? !target.member?.hasPermission(target, "ManageRole")  : target.ownerId != useClient().user?.id);

    function onchange() {
        let changed: bigint;
        if (checked) {
            changed = value | permission;
        } else {
            changed = value & ~permission;
        }
        console.debug(changed);
        if (changed != value) {
            onChange(changed);
        }
    }
</script>

<PermissionEntry {id}>
    <Checkbox {disabled} value={permission} bind:checked onchange={onchange} />
</PermissionEntry>