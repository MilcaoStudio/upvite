<script>
    import { t } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import { noopTrue } from "$lib";
    import { createTextSnippet } from "$lib/i18n/TextSvelte.svelte";
    const ok = createTextSnippet(()=>$t("app.special.modals.actions.ok"));
</script>

<Dialog
    title={$t("app.special.modals.signed_out")}
    actions={[
        {
            onClick: noopTrue,
            confirmation: true,
            children: ok,
        },
    ]}
/>
