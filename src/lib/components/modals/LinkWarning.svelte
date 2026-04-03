<script lang="ts">
    import type { ModalProps } from "$lib/types/Modal";
    import { t } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import { noopTrue } from "$lib";
    import { useState } from "../state/StateContext.svelte";
    import { createTextSnippet } from "$lib/i18n/TextSvelte.svelte";

    interface Props {
        props: ModalProps<"link_warning">;
    }

    let { props }: Props = $props();
    const settings = useState().settings;

</script>

<Dialog
    {...props}
    title={$t("app.special.modals.external_links.title")}
    actions={[
        {
            onClick: props.callback,
            confirmation: true,
            palette: "accent",
            children: createTextSnippet(()=>$t("app.special.modals.actions.continue")),
        },
        {
            onClick: noopTrue,
            confirmation: false,
            children: createTextSnippet(()=>$t("app.special.modals.actions.cancel")),
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
            children: createTextSnippet(()=>$t("app.special.modals.external_links.trust_domain")),
        },
    ]}
>
    {$t("app.special.modals.external_links.short")}<br />
    <span>{props.link}</span>
</Dialog>
