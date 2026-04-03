<script lang="ts">
    import type { ModalProps } from "$lib/types/Modal";
    import { t } from "svelte-i18n";
    import DialogForm from "./DialogForm.svelte";
    import { createElement } from "$lib/markdown/runtime/svelteRuntime";
    import Message from "../messaging/Message.svelte";
    import { createTextSnippet } from "$lib/i18n/TextSvelte.svelte";

    interface Props {
        props: ModalProps<"delete_message">;
    }

    let { props }: Props = $props();
</script>

{#snippet message()}
    <Message message={props.target} head compact />
{/snippet}

<DialogForm
    {...props}
    title={$t("app.context_menu.delete_message")}
    schema={{
        message: "snippet",
    }}
    data={{
        message,
    }}
    callback={() => props.target.delete()}
    submit={{
        palette: "error",
        children: createTextSnippet(()=>$t("app.special.modals.actions.delete")),
    }}
>
    {#snippet description()}
        <span 
            >{$t("app.special.modals.prompt.confirm_delete_message_long")}</span
        >
    {/snippet}
</DialogForm>
