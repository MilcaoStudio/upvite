<script>
    import { t } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import { noopTrue } from "$lib";
</script>

<Dialog
    title={$t("app.special.modals.signed_out")}
    actions={[
        {
            onClick: noopTrue,
            confirmation: true,
            children: $t("app.special.modals.actions.ok"),
        },
    ]}
/>
