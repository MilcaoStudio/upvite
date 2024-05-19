<script lang="ts">
  import H3 from "$lib/components/atoms/heading/H3.svelte";
  import ColorSwatches from "$lib/components/atoms/input/ColorSwatches.svelte";
  import InputBox from "$lib/components/form/InputBox.svelte";
  import { t } from "svelte-i18n";
  import type { API, Server } from "revolt.js";
  import { getRoles, type RoleOrDefault } from "$lib/types/Permissions";
  import { Button, Checkbox } from "fluent-svelte";
  import PermissionList from "../permissions/PermissionList.svelte";
  import isEqual from "lodash.isequal";

  export let selected: string, server: Server;
  $: currentRole = getRoles(server).find((x) => x.id == selected)!;
  $: clientPermission = server.permission;
  let role: Partial<RoleOrDefault> = {};
  $: mutableRole = { ...currentRole, ...role };

  $: disabled =
    !server.member?.hasPermission(server, "ManageRole") ||
    (server.member?.ranking ?? Infinity) > (currentRole.rank ?? 0);
  function onPermissionsChange(permissions: number | API.OverrideField) {
    role = { ...role, permissions } as RoleOrDefault;
  }

  function save() {
    const { permissions: permsCurrent, ...current } = currentRole;
    const { permissions: permsValue, ...value } = mutableRole;
    if (!isEqual(permsCurrent, permsValue)) {
      server.setPermissions(
        selected,
        typeof permsValue == "number"
          ? permsValue
          : {
              allow: permsValue.a,
              deny: permsValue.d,
            }
      );
    }
  }
</script>

<div>
  <Button
    palette="secondary"
    disabled={isEqual(currentRole, mutableRole)}
    onClick={save}
  >
    {$t("app.special.modals.actions.save")}
  </Button>
  {#if selected != "default"}
    <H3>{$t("app.settings.permissions.role_name")}</H3>
    <InputBox
      {disabled}
      bind:value={mutableRole.name}
      type="text"
      placeholder="Nuevo rol"
    />

    <H3>{$t("app.settings.permissions.role_colour")}</H3>
    <ColorSwatches
      {disabled}
      colour={mutableRole.colour}
      onChange={(colour) => (role = { ...role, colour })}
    />

    <H3>{$t("app.settings.permissions.role_options")}</H3>
    <Checkbox {disabled} bind:checked={mutableRole.hoist}
      >{$t("app.settings.permissions.hoist_desc")}</Checkbox
    >
    <H3>{$t("app.settings.permissions.role_ranking")}</H3>
    <InputBox {disabled} bind:value={mutableRole.rank} type="number" />
  {/if}
  <H3>{$t("app.settings.permissions.edit_title")}</H3>

  <PermissionList
    target={server}
    value={mutableRole.permissions}
    onChange={onPermissionsChange}
  />
</div>
