<script lang="ts">
    import { run } from 'svelte/legacy';

    import Button from "$lib/components/atoms/Button.svelte";
    import H1 from "$lib/components/atoms/heading/H1.svelte";
    import { translate } from "$lib/i18n";
    import { getRoles, type RoleOrDefault } from "$lib/types/Permissions";
    import isEqual from "lodash.isequal";
    import { Channel, DEFAULT_PERMISSION_DIRECT_MESSAGE, Permission } from "stoat.js";
    import { t } from "svelte-i18n";
    import PermissionList from "./PermissionList.svelte";

    interface Props {
        selected: string;
        channel: Channel;
    }

    let { selected, channel }: Props = $props();
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
              ])
            : getRoles(channel.server!).map((role) => ({
                  ...role,
                  permissions: (role.id == "default"
                      ? channel.defaultPermissions
                      : channel.rolePermissions?.[role.id]) ?? {
                      a: 0n,
                      d: 0n,
                  },
              }))!;
    let currentRole = $derived(currentRoles.find((x) => x.id == selected)!);
    let currentPermission;
    run(() => {
        currentPermission = currentRole.permissions;
    });
    let currentValue;
    run(() => {
        currentValue = currentPermission;
    });
    run(() => {
        console.log(currentPermission, "=>", currentValue);
    });

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
    run(() => {
        channel.type != "Group" && items.add("ViewChannel");
    });
    function onChange(value: bigint | {a: bigint, d: bigint}) {
        currentValue = value;
    }

    function save() {
        const permissions = typeof currentValue == "bigint" ? Number(currentValue) : {
            allow: Number(currentValue.a),
            deny: Number(currentValue.d)
        }
        channel.setPermissions(
            selected,
            permissions,
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
