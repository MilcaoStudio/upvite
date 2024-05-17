<script lang="ts">
    import { type Permission, type Channel, Server, type API } from "revolt.js";
    import Long from "long";
    import Lock from "svelte-boxicons/BxLock.svelte";
    import { t } from "svelte-i18n";
    import OverrideSwitch from "$lib/components/atoms/input/OverrideSwitch.svelte";
    import type { SwitchState } from "$lib/types/Form";
    import { Checkbox } from "fluent-svelte";
    import { useClient } from "$lib/controllers/ClientController";

    export let id: keyof typeof Permission,
        target: Channel,
        permission: number,
        value: number,
        onChange: (value: number) => void;
    
    let checked = Long.fromNumber(value).and(permission).eq(permission);
    let lastChecked = checked;
    let disabled = target.owner_id != useClient().user?._id;
    $: if (lastChecked != checked) {
        console.log(Long.fromNumber(value, false).xor(permission).toNumber());
        lastChecked = checked;
        onChange(Long.fromNumber(value, false).xor(permission).toNumber());
    }
    /*
    // Move to ServerPermissionSelect
    function onSwitch(state: PermissionState) {
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
    }*/
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label
    class="PermissionEntry"
    style={disabled ? "color: var(--tertiary-foreground);" : ""}
>
    <span class="title">
        <span>
            {$t(`permissions.${id}.t`, { default: id })}
            {#if disabled}
                <Lock size={14} class="lock" />
            {/if}
        </span>
        <span class="description">
            {$t(`permissions.${id}.d`)}
        </span>
    </span>
    <!-- TODO: switch/checkbox input-->
       <!-- <OverrideSwitch {disabled} {state} onChange={onSwitch} />--> 
    <Checkbox {disabled} value={permission} bind:checked />
</label>

<style>
    .PermissionEntry {
        gap: 8px;
        width: 100%;
        margin: 8px 0;
        display: flex;
        align-items: center;
    }

    .title {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    :global(.lock) {
        margin-inline-start: 4px;
    }

    .description {
        font-size: 0.8em;
        color: var(--secondary-foreground);
    }
</style>
