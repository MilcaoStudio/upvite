<!--Experimental: Replace Modal by ContentDialog-->
<script lang="ts">
    import type { Action } from "$lib/types/Modal";
    import { ContentDialog }  from "fluent-svelte";
    import H4 from "../atoms/heading/H4.svelte";
    import { cx } from "@emotion/css";
    import Button from "../atoms/Button.svelte";
    import type { Snippet } from "svelte";
    interface Props {
        open?: boolean;
        disabled?: boolean;
        nonDismissable?: boolean;
        title?: string | undefined;
        onClose?: (force: boolean) => void;
        actions?: Action[];
        signal?: "close" | "confirm" | "force" | undefined;
        registerOnClose?: (fn: () => void) => () => void;
        registerOnConfirm?: (fn: () => void) => () => void;
        description?: Snippet;
        children?: Snippet;
    }

    let {
        open = $bindable(true),
        disabled = false,
        nonDismissable = false,
        title = undefined,
        onClose = function () {},
        actions = [],
        signal = $bindable(),
        registerOnClose = (fn) => fn,
        registerOnConfirm = (fn) => fn,
        description,
        children,
        ...rest
    }: Props = $props();
    async function confirm() {
        const action = actions.find((x) => x.confirmation);
        const success = await action?.onClick?.();
        if (success) {
            closeModal();
            console.log("[confirm] Closing modal");
        }
    }
    let closeModal = $derived(function () {
        setTimeout(function () {
            open = false;
            onClose(true);
        }, 10);
        console.log("[closeModal] Closing modal");
    });
    $effect(() => {
        if (signal == "confirm") {
            signal = undefined;
            confirm();
        } else if (signal) {
            const cannotClose = signal == "close" && nonDismissable;
            if (!cannotClose) {
                closeModal();
            }
        }
    });
    $effect(() => {
        registerOnClose(closeModal);
        registerOnConfirm(confirm);
    });
</script>

<ContentDialog bind:open {title} {...rest} closable={!nonDismissable} on:close={closeModal}>
    <H4>{@render description?.()}</H4>
    {@render children?.()}
    {#if actions.length}
        <div class={cx("Actions")}>
            {#each actions as action}
                {@const {onClick, children, ...buttonProps} = action}
                <Button {disabled} {...buttonProps}
                    onclick={async () => {
                        if (await onClick()) closeModal();
                    }}
                >
                    {@render children?.()}
                </Button>
            {/each}
        </div>
    {/if}
</ContentDialog>
