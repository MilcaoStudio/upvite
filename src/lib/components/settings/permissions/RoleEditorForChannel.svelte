<script lang="ts">
    import Button from "$lib/components/atoms/Button.svelte";
    import H1 from "$lib/components/atoms/heading/H1.svelte";
    import { translate } from "$lib/i18n";
    import { getRoles } from "$lib/types/Permissions";
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
        $derived(channel?.type == "Group"
            ? ([
                  {
                      id: "default",
                      name: "Default",
                      permissions:
                          channel.permissions ??
                          DEFAULT_PERMISSION_DIRECT_MESSAGE,
                  },
              ])
            : channel.server ? getRoles(channel.server).map((role) => ({
                  ...role,
                  permissions: (role.id == "default"
                      ? channel.defaultPermissions
                      : channel.rolePermissions?.[role.id]) ?? {
                      a: 0n,
                      d: 0n,
                  },
              })) : []);
    let currentRole = $derived(currentRoles.find((x) => x.id == selected));
    let currentPermissions = $derived(currentRole?.permissions);
    let currentValue = $derived(currentRole?.permissions);

    function onChange(value: bigint | {a: bigint, d: bigint}) {
        currentValue = value;
    }

    function save() {
        if(!currentValue) {
            return;
        }
        const permissions = typeof currentValue == "bigint" ? Number(currentValue) : {
            allow: Number(currentValue.a),
            deny: Number(currentValue.d)
        }
        channel.setPermissions(
            selected,
            permissions,
        ).then(_=>currentPermissions = currentValue);
    }

    const items = new Set<keyof typeof Permission>([
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
</script>

<div>
    <div
        style="display: flex; justify-content: space-between; align-items: center;"
    >
        <H1>
            {translate("app.settings.permissions.title", {
                role: currentRole?.name || "",
            })}
        </H1>
        <Button
            palette="secondary"
            disabled={isEqual(currentPermissions, currentValue)}
            onclick={save}
        >
            {$t("app.special.modals.actions.save")}
        </Button>
    </div>
    {#if currentValue || currentValue == 0n}
        <PermissionList
            {items}
            target={channel}
            value={currentValue}
            onChange={onChange}
        />
    {/if}
</div>
