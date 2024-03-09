<script lang="ts">
    import { state } from "$lib/State";
    import type { ModalProps } from "$lib/types/Modal";
    import { t } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import { noopTrue } from "$lib";

    export let props: ModalProps<"link_warning">;
    const settings = state.settings;
</script>

<Dialog
    {...props}
    title={$t("app.special.modals.external_links.title")}
    actions={[
        {
            onClick: props.callback,
            confirmation: true,
            palette: "accent",
            children: "Continue",
        },
        {
            onClick: noopTrue,
            confirmation: false,
            children: "Cancel",
        },
        {
            onClick: () => {
                try {
                    const url = new URL(props.link);
                    settings.security.addTrustedOrigin(url.hostname);
                } catch (e) {}

                return props.callback();
            },
            palette: "plain",
            children: $t("app.special.modals.external_links.trust_domain"),
        },
    ]}
>
    {$t("app.special.modals.external_links.short")}<br />
    <span>{props.link}</span>
</Dialog>
