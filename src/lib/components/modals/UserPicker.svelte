<script lang="ts">
    import { useClient } from "$lib/controllers/ClientController";
    import type { ModalProps } from "$lib/types/Modal";
    import { t } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import List from "../atoms/layout/List.svelte";
    import UserCheckbox from "../user/UserCheckbox.svelte";

    interface Props {
        props: ModalProps<"user_picker">;
        [key: string]: any
    }

    let { props, ...rest }: Props = $props();
    let selected = new Set<string>();
    let omitted = new Set([
        ...(props.omit || []),
        "00000000000000000000000000",
    ]);
    let client = useClient();

    let friends = $derived([...client.users.values()].filter(
        (u) => u.relationship == "Friend" && !omitted.has(u.id),
    ));
</script>

<Dialog
    {...rest}
    title={$t("app.special.popovers.user_picker.select")}
    actions={[
        {
            children: $t("app.special.modals.actions.ok"),
            onClick: () => props.callback([...selected]).then(() => true),
        },
    ]}
>
    <List>
        {#each friends as user (user.id)}
            <UserCheckbox
                checked={selected.has(user.id)}
                {user}
                onChange={(v) =>
                    v ? selected.add(user.id) : selected.delete(user.id)}
            />
        {/each}
    </List>
</Dialog>
