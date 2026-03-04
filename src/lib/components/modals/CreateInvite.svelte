<script lang="ts">
    import { run } from 'svelte/legacy';

    import type { ModalProps } from "$lib/types/Modal";
    import { t } from "svelte-i18n";
    import DialogForm from "./DialogForm.svelte";
    import { createElement } from "$lib/markdown/runtime/svelteRuntime";
    import TextSvelte from "$lib/i18n/TextSvelte.svelte";
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
    let { target } = props;
    let processing = $state(false),
        code = $state("");
    run(() => {
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

    let data = $derived({
        message: {
            element: processing
                ? createElement(TextSvelte, {
                      id: "app.special.modals.prompt.create_invite_generate",
                  })
                : createElement(
                      "div",
                      { class: InviteCard },
                      createElement(TextSvelte, {
                          id: "app.special.modals.prompt.create_invite_created",
                      }),
                      createElement("code", null, code),
                  ),
        },
    });
</script>

<DialogForm
    title={$t("app.context_menu.create_invite")}
    schema={{ message: "custom" }}
    {data}
    callback={async () => {}}
    submit={{ children: $t("app.special.modals.actions.ok") }}
    actions={[
        {
            children: $t("app.context_menu.copy_link"),
            onClick: () =>
                modalController.writeText(
                    `${window.location.host}/invite/${code}`,
                ),
        },
    ]}
/>
