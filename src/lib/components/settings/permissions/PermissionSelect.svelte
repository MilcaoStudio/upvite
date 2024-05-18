<script lang="ts">
    import { type Permission, type Channel, Server, type API } from "revolt.js";
    import Long from "long";
    import OverrideSwitch from "$lib/components/atoms/input/OverrideSwitch.svelte";
    import type { SwitchState } from "$lib/types/Form";
    import PermissionEntry from "../permissions/PermissionEntry.svelte";

    export let id: keyof typeof Permission,
        target: Channel | Server,
        permission: number,
        value: API.OverrideField,
        onChange: (value: API.OverrideField) => void;

    let state: SwitchState = "Neutral";
    $: if (Long.fromNumber(value.d).and(permission).eq(permission)) {
        state = "Deny";
    } else if (Long.fromNumber(value.a).and(permission).eq(permission)) {
        state = "Allow";
    } else {
        state = "Neutral";
    }

    function onSwitch(state: SwitchState) {
        if (typeof value != "object")
            throw TypeError(
                "value should be an object. Friendly reminder: You may report this issue in GitHub.",
            );
        // Convert to Long so we can do bitwise ops.
        let allow = Long.fromNumber(value.a);
        let deny = Long.fromNumber(value.d);

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
            a: allow.toNumber(),
            d: deny.toNumber(),
        });
    }

    $: member = target && (target instanceof Server ? target.member : target.server?.member);
    $: disabled = member && !member.hasPermission(target!, id);
</script>

<PermissionEntry {disabled} {id}>
    <OverrideSwitch {disabled} {state} onChange={onSwitch} />
</PermissionEntry>
