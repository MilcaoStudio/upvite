<script lang="ts">
    import type { Action } from "$lib/types/Modal";
    import H2 from "../atoms/heading/H2.svelte";
    import H4 from "../atoms/heading/H4.svelte";
    import Button from "../atoms/Button.svelte";
    import { css, cx } from "@emotion/css";

    interface Props {
        padding?: boolean;
        maxWidth?: string;
        maxHeight?: string;
        disabled?: boolean;
        transparent?: boolean;
        nonDismissable?: boolean;
        actions?: Action[];
        onClose?: (force: boolean) => void;
        signal?: "close" | "confirm" | "force" | undefined;
        registerOnClose?: (fn: () => void) => () => void;
        registerOnConfirm?: (fn: () => void) => () => void;
        override?: import('svelte').Snippet;
        title?: import('svelte').Snippet;
        description?: import('svelte').Snippet;
        children?: import('svelte').Snippet;
    }

    let {
        padding = true,
        maxWidth = "",
        maxHeight = "",
        disabled = false,
        transparent = false,
        nonDismissable = false,
        actions = [],
        onClose = function () {},
        signal = undefined,
        registerOnClose = (fn) => fn,
        registerOnConfirm = (fn) => fn,
        override,
        title,
        description,
        children
    }: Props = $props();

    let closing = $state(false);
    const Base = $derived(cx(
        "Base",
        css`
            ${closing ? "animation-name: fadeOut" : "animation-name: svelte-1qibxfp-menu-open"}

            > div {
                ${closing ? "animation-name: zoomOut" : ""}
            }
        `,
    ));

    const Container = $derived(cx(
        "Container",
        css`
            max-width: min(calc(100vw - 20px), ${maxWidth || "450px"});
            max-height: min(calc(100vh - 20px), ${maxHeight || "650px"});
            ${!maxWidth ? "width: 100%;" : ""}
            ${!transparent
                ? "background: var(--secondary-header); border-radius: var(--border-radius);"
                : ""}
        `,
    ));
    const Content = $derived(cx(
        "Content",
        css`
            padding: ${padding ? "0 1rem 1rem" : ""};
            ${!transparent ? "background: var(--secondary-header);" : ""}
        `,
    ));
    const Actions = cx("Actions");

    let closeModal = $derived(function () {
        if (!closing) {
            setTimeout(function () {
                onClose(true);
            }, 200);
        }
        closing = true;
        console.log("[closeModal] Closing modal");
    });

    async function confirm() {
        if (await actions.find((x) => x.confirmation)?.onClick?.()) {
            closeModal();
            console.log("[confirm] Closing modal");
        }
    }

    $effect(() => {
        registerOnClose(closeModal);
        registerOnConfirm(confirm);
    });

    $effect(() => {
        if (signal == "confirm") {
            confirm();
        } else if (signal) {
            const cannotClose = signal == "close" && nonDismissable;
            if (!cannotClose) {
                closeModal();
            }
        }
    });
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    class={Base}
    role="dialog"
    tabindex="0"
    onclick={() => !nonDismissable && closeModal()}
    onkeydown={() => !nonDismissable && closeModal()}
>
        <div
            class={Container}
            role="none"
            onclick={(ev)=>ev.stopPropagation()}
            onkeydown={(ev)=>ev.stopPropagation()}
        >
    {#if override}{@render override()}{:else}
            <div class="Title">
                <H2>{@render title?.()}</H2>
                <H4>{@render description?.()}</H4>
            </div>
            <div class={Content}>{@render children?.()}</div>
            {#if actions.length}
                <div class={Actions}>
                    {#each actions as action}
                        <Button
                            {disabled}
                            {...action }
                            onclick={async () => {
                                if (await action.onClick()) closeModal();
                            }}
                        >
                            {action.text}
                        </Button>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</div>
