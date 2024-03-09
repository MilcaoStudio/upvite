<script lang="ts">
    import type { ModalProps } from "$lib/types/Modal";
    import { t } from "svelte-i18n";
    import DialogForm from "./DialogForm.svelte";
    import { createElement } from "$lib/markdown/runtime/svelteRuntime";
    import Message from "../messaging/Message.svelte";

    export let props: ModalProps<"delete_message">;
    let data = {
        message: {
            element: createElement(Message, {
                message: props.target,
                head: true,
                compact: true,
            }),
        },
    };
</script>

<DialogForm
    {...props}
    title={$t("app.context_menu.delete_message")}
    schema={{
        message: "custom",
    }}
    {data}
    callback={() => props.target.delete()}
    submit={{
        palette: "error",
        children: $t("app.special.modals.actions.delete"),
    }}
>
    <span slot="description"
        >{$t("app.special.modals.prompt.confirm_delete_message_long")}</span
    >
</DialogForm>
