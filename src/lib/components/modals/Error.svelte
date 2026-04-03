<script lang="ts">
    import { _ } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import type { ModalProps } from "$lib/types/Modal";
    interface Props {
        props: ModalProps<"error">;
    }

    let { props }: Props = $props();
</script>

<Dialog
    {...props}
    title={$_("app.special.modals.error")}
    actions={[
        {
            onClick: () => {
                if (props.error == "InvalidSession") {
                    console.debug("OK clicked");
                    return true;
                }
                return true;
            },
            confirmation: true,
            text: $_("app.special.modals.actions.ok"),
        },
        {
            palette: "plain-secondary",
            onClick: () => location.reload(),
            text: $_("app.special.modals.actions.reload"),
        },
    ]}
>
    {$_(`error.${props.error}`) || props.error}
</Dialog>
