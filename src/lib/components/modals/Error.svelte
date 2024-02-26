<script lang="ts">
    import { _ } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import type { ModalProps } from "$lib/types/Modal";
    export let props: ModalProps<"error">
</script>

<Dialog
    {...props}
    title={$_("app.special.modals.error")}
    actions={[
        {
            onClick: () => true,
            confirmation: true,
            children: $_("app.special.modals.actions.ok"),
        },
        {
            palette: "plain-secondary",
            onClick: () => location.reload(),
            children: $_("app.special.modals.actions.reload"),
        },
    ]}
>
    {$_(`errors.${props.error}`) || props.error}
</Dialog>
