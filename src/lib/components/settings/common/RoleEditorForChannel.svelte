<script lang="ts">
    import Button from "$lib/components/atoms/Button.svelte";
    import H1 from "$lib/components/atoms/heading/H1.svelte";
    import { translate } from "$lib/i18n";
    import type { RoleOrDefault } from "$lib/types/Permissions";
    import { isEqual } from "lodash";
    import { API, Channel, DEFAULT_PERMISSION_DIRECT_MESSAGE } from "revolt.js";
    import { t } from "svelte-i18n";
    import GroupPermissionList from "./GroupPermissionList.svelte";

    export let selected: string, channel: Channel;
    let currentRoles =
        channel?.channel_type == "Group"
            ? ([
                  {
                      id: "default",
                      name: "Default",
                      permissions:
                          channel.permissions ??
                          DEFAULT_PERMISSION_DIRECT_MESSAGE,
                  },
              ] as RoleOrDefault[])
            : channel?.server?.orderedRoles?.map((role) => ({
                  ...role,
                  permissions: (role.id == "default"
                      ? channel.default_permissions
                      : channel.role_permissions?.[role.id]) ?? {
                      a: 0,
                      d: 0,
                  },
              }))!;
    let currentRole = currentRoles.find((x) => x.id == selected)!;
    let currentPermission = currentRole.permissions;
    let currentValue = currentPermission;
    $: console.log(currentPermission, "=>", currentValue);

    function onChange(value: number | API.OverrideField) {
        currentValue = value;
    }

    function save() {
        console.log(`Updating permissions ${currentValue} for ${channel._id}`);
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
    {#if typeof currentValue == "number"}
        <GroupPermissionList
            items={[
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
            ]}
            target={channel}
            value={currentValue}
            onChange={onChange}
        />
    {/if}
</div>
