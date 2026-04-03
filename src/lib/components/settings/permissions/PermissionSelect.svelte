<script lang="ts">
    import { type Permission, type Channel, Server } from "stoat.js";
    import Long from "long";
    import OverrideSwitch from "$lib/components/atoms/input/OverrideSwitch.svelte";
    import type { SwitchState } from "$lib/types/Form";
    import PermissionEntry from "../permissions/PermissionEntry.svelte";

    interface Props {
        id: keyof typeof Permission;
        target: Channel | Server;
        permission: bigint;
        value: {a: bigint, d: bigint};
        onChange: (value: {a: bigint, d: bigint}) => void;
    }

    let {
        id,
        target,
        permission,
        value,
        onChange
    }: Props = $props();

    let state: SwitchState = $derived.by(() => {
        if (Long.fromBigInt(value.d).and(permission).eq(permission)) {
            return "Deny";
        } else if (Long.fromBigInt(value.a).and(permission).eq(permission)) {
            return "Allow";
        } else {
            return "Neutral";
        }
    });

    function onSwitch(state: SwitchState) {
        if (typeof value != "object")
            throw TypeError(
                "value should be an object. Friendly reminder: You may report this issue in GitHub.",
            );
        // Convert to Long so we can do bitwise ops.
        let allow = Long.fromBigInt(value.a);
        let deny = Long.fromBigInt(value.d);

        // Clear the current permission value.
        if (allow.and(permission).eq(permission)) {
            allow = allow.xor(permission);
        }

        if (deny.and(permission).eq(permission)) {
            deny = deny.xor(permission);
        }

        // Apply the current permission state.
        if (state == "Allow") {
            allow = allow.or(permission);
        }

        if (state == "Deny") {
            deny = deny.or(permission);
        }

        // Invoke state change.
        onChange({
            a: allow.toBigInt(),
            d: deny.toBigInt(),
        });
    }

    let member = $derived(target && (target instanceof Server ? target.member : target.server?.member));
    let disabled = $derived(member && !(member.hasPermission(target!, id) && member.hasPermission(target!, "ManageRole")));
</script>

<PermissionEntry {disabled} {id}>
    <OverrideSwitch {disabled} {state} onChange={onSwitch} />
</PermissionEntry>
