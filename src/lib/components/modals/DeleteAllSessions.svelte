<script lang="ts">
    import type { ModalProps } from "$lib/types/Modal";
    import { t } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import { noopTrue } from "$lib";

    interface Props {
        props: ModalProps<"sign_out_sessions">;
    }

    let { props }: Props = $props();
    function onClick(){
        props.onDeleting();
        props.client.api.delete("/auth/session/all").then(props.onDelete);
        return true;
    };
</script>

<Dialog title={$t("app.special.modals.sessions.title")} actions={[
    {
        onClick: noopTrue,
        palette: "accent",
        confirmation: true,
        text: $t("app.special.modals.actions.back"),
    },
    {
        onClick,
        confirmation: true,
        text: $t("app.special.modals.sessions.accept"),
    },
]}>
{$t("app.special.modals.sessions.short")}
</Dialog>