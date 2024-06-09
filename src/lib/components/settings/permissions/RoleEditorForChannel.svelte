<script lang="ts">
    import Button from "$lib/components/atoms/Button.svelte";
    import H1 from "$lib/components/atoms/heading/H1.svelte";
    import { translate } from "$lib/i18n";
    import { getRoles, type RoleOrDefault } from "$lib/types/Permissions";
    import { isEqual } from "lodash";
    import { API, Channel } from "revolt.js";
    import { t } from "svelte-i18n";
    import PermissionList from "./PermissionList.svelte";
    import { DEFAULT_PERMISSION_DIRECT_MESSAGE, Permission } from "revolt.js/lib/esm/permissions/definitions";

    export let selected: string, channel: Channel;
    let currentRoles =
        channel?.type == "Group"
            ? ([
                  {
                      id: "default",
                      name: "Default",
                      permissions:
                          channel.permissions ??
                          DEFAULT_PERMISSION_DIRECT_MESSAGE,
                  },
              ] as RoleOrDefault[])
            : getRoles(channel.server!).map((role) => ({
                  ...role,
                  permissions: (role.id == "default"
                      ? channel.defaultPermissions
                      : channel.rolePermissions?.[role.id]) ?? {
                      a: 0,
                      d: 0,
                  },
              }))!;
    $: currentRole = currentRoles.find((x) => x.id == selected)!;
    $: currentPermission = currentRole.permissions;
    $: currentValue = currentPermission;
    $: console.log(currentPermission, "=>", currentValue);

    let items = new Set<keyof typeof Permission>([
                "ReadMessageHistory",
                "SendMessage",
                "ManageMessages",
                "InviteOthers",
                "SendEmbeds",
                "UploadFiles",
                "Masquerade",
                "React",
                "ManageChannel",
                "ManagePermissions",
    ]);
    $: channel.type != "Group" && items.add("ViewChannel");
    function onChange(value: number | API.OverrideField) {
        currentValue = value;
    }

    function save() {
        channel.setPermissions(
            selected,
            !currentValue || typeof currentValue == "number"
                ? currentValue
                : ({
                      allow: currentValue.a,
                      deny: currentValue.d,
                  } as any),
        ).then(_=>currentPermission = currentValue);
    }
</script>

<div>
    <div
        style="display: flex; justify-content: space-between; align-items: center;"
    >
        <H1>
            {translate("app.settings.permissions.title", {
                role: currentRole.name,
            })}
        </H1>
        <Button
            palette="secondary"
            disabled={isEqual(currentPermission, currentValue)}
            onClick={save}
        >
            {$t("app.special.modals.actions.save")}
        </Button>
    </div>
        <PermissionList
            {items}
            target={channel}
            value={currentValue}
            onChange={onChange}
        />
</div>
