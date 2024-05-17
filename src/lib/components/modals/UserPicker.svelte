<script lang="ts">
    import { useClient } from "$lib/controllers/ClientController";
    import type { ModalProps } from "$lib/types/Modal";
    import { t } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import List from "../atoms/layout/List.svelte";
    import UserCheckbox from "../user/UserCheckbox.svelte";

    export let props: ModalProps<"user_picker">;
    let selected = new Set<string>();
    let omitted = new Set([
        ...(props.omit || []),
        "00000000000000000000000000",
    ]);
    let client = useClient();

    $: friends = [...client.users.values()].filter(
        (u) => u.relationship == "Friend" && !omitted.has(u._id),
    );
</script>

<Dialog
    {...$$restProps}
    title={$t("app.special.popovers.user_picker.select")}
    actions={[
        {
            children: $t("app.special.modals.actions.ok"),
            onClick: () => props.callback([...selected]).then(() => true),
        },
    ]}
>
    <List>
        {#each friends as user (user._id)}
            <UserCheckbox
                checked={selected.has(user._id)}
                {user}
                onChange={(v) =>
                    v ? selected.add(user._id) : selected.delete(user._id)}
            />
        {/each}
    </List>
</Dialog>
