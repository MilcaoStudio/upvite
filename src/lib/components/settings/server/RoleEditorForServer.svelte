<script lang="ts">
    import H3 from "$lib/components/atoms/heading/H3.svelte";
    import ColorSwatches from "$lib/components/atoms/input/ColorSwatches.svelte";
    import InputBox from "$lib/components/form/InputBox.svelte";
    import { t } from "svelte-i18n";
    import type { API, Server } from "revolt.js";
    import { getRoles } from "$lib/types/Permissions";
    import { Button, Checkbox } from "fluent-svelte";
    import PermissionList from "../permissions/PermissionList.svelte";
    import isEqual from "lodash.isequal";
    import Gradient from "gradient-parser";

    export let selected: string, server: Server;
    let currentRoles = getRoles(server).map((role) => ({
        ...role,
        permissions: (role.id == "default"
            ? server.default_permissions
            : server.roles?.[role.id].permissions) ?? {
            a: 0,
            d: 0,
        },
    }))!;

    let currentRole = currentRoles.find((x) => x.id == selected)!;
    $: currentPermission = currentRole.permissions;
    $: currentValue = currentPermission;
    $: console.log(currentPermission, "=>", currentValue);
    $: name = currentRole.name;
    let parsedColour = currentRole.colour ? Gradient.parse(currentRole.colour) :  null;
    let colour: string | null = null;
    $: rank = currentRole.rank;
    $: hoist = currentRole.hoist;

    let disabled =
        !server.member?.hasPermission(server, "ManageRole") ||
        (server.member?.ranking ?? Infinity) > (currentRole.rank ?? 0);
    function onPermissionsChange(value: number | API.OverrideField) {
        currentValue = value;
    }

    function save() {
        server
            .setPermissions(
                selected,
                !currentValue || typeof currentValue == "number"
                    ? currentValue
                    : ({
                          allow: currentValue.a,
                          deny: currentValue.d,
                      } as any),
            )
            .then((_) => (currentPermission = currentValue));
    }
</script>

<div>
    <Button
        palette="secondary"
        disabled={isEqual(currentPermission, currentValue) ||
            isEqual(currentRole, { name, colour, rank, hoist })}
        onClick={save}
    >
        {$t("app.special.modals.actions.save")}
    </Button>
    {#if selected != "default"}
        <H3>{$t("app.settings.permissions.role_name")}</H3>
        <InputBox
            {disabled}
            bind:value={name}
            type="text"
            placeholder="Nuevo rol"
        />

        <H3>{$t("app.settings.permissions.role_colour")}</H3>
        <ColorSwatches {disabled} onChange={(color) => (colour = color)} />

        <H3>{$t("app.settings.permissions.role_options")}</H3>
        <Checkbox {disabled} bind:checked={hoist}
            >{$t("app.settings.permissions.hoist_desc")}</Checkbox
        >
        <H3>{$t("app.settings.permissions.role_ranking")}</H3>
        <InputBox {disabled} bind:value={rank} type="number" />
    {/if}
    <H3>{$t("app.settings.permissions.edit_title")}</H3>

    {#key currentPermission}
        <PermissionList
            target={server}
            value={currentValue}
            onChange={onPermissionsChange}
        />
    {/key}
</div>
