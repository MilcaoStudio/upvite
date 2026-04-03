<script lang="ts">
    import type { ModalProps } from "$lib/types/Modal";
    import { t } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import { noopTrue } from "$lib";

    // export let props: ModalProps<"clipboard"> = $props();
    interface Props {
        props: ModalProps<"clipboard">;
    }

    let { props }: Props = $props();
</script>

{#snippet closeText()}{$t("app.special.modals.actions.close")}{/snippet}

<Dialog
    {...props}
    title={$t("app.special.modals.clipboard.unavailable")}
    actions={[
        {
            onClick: noopTrue,
            confirmation: true,
            children: closeText,
        },
    ]}
>
    {#snippet description()}
            {#if location.protocol != "https:"}
                {$t("app.special.modals.clipboard.https")}
            {/if}
    {/snippet}
    {$t("app.special.modals.clipboard.copy")}
    <code style:user-select="all" style:word-break="break-all">
        {props.text}
    </code>
</Dialog>
