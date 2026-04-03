<script lang="ts">
    import type { ModalProps } from "$lib/types/Modal";
    import { t } from "svelte-i18n";
    import DialogForm from "./DialogForm.svelte";
    import TextSvelte, { createTextSnippet } from "$lib/i18n/TextSvelte.svelte";
    import { css, cx } from "@emotion/css";
    import { modalController } from "./ModalController";
    import { takeError } from "$lib";

    const InviteCard = cx(
        "InviteCard",
        css`
            display: flex;
            flex-direction: column;

            code {
                padding: 1em;
                user-select: all;
                font-size: 1.4em;
                text-align: center;
                font-family: var(--monospace-font);
            }
        `,
    );
    interface Props {
        props: ModalProps<"create_invite">;
    }

    let { props }: Props = $props();
    let { target } = $derived(props);
    let processing = $state(false),
        code = $state("");
    $effect(() => {
        if (target) {
            processing = true;
            target
                .createInvite()
                .then(({ _id }) => (code = _id))
                .catch((err) =>
                    modalController.push({ type: "error", error: takeError(err) }),
                )
                .finally(() => (processing = false));
        }
    });

    const copyLink = createTextSnippet(()=>$t("app.context_menu.copy_link"));
    const submit = createTextSnippet(()=>$t("app.special.modals.actions.ok"));
</script>

{#snippet message()}
    {#if processing}
        <TextSvelte id="app.special.modals.prompt.create_invite_generate" />
    {:else}
        <div class={InviteCard}>
            <TextSvelte id="app.special.modals.prompt.create_invite_created" />
            <code>{code}</code>
        </div>
    {/if}
{/snippet}

<DialogForm
    title={$t("app.context_menu.create_invite")}
    schema={{ message: "snippet" }}
    data={{
        message,
    }}
    callback={async () => {}}
    submit={{children: submit}}
    actions={[
        {
            children: copyLink,
            onClick: () =>
                modalController.writeText(
                    `${window.location.host}/invite/${code}`,
                ),
        },
    ]}
/>
