<!--Experimental: Replace Modal by ContentDialog-->
<script lang="ts">
    import { run } from 'svelte/legacy';

    import type { Action } from "$lib/types/Modal";
    import { ContentDialog }  from "fluent-svelte";
    import H4 from "../atoms/heading/H4.svelte";
    import { cx } from "@emotion/css";
    import Button from "../atoms/Button.svelte";
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
        description?: import('svelte').Snippet;
        children?: import('svelte').Snippet;
        [key: string]: any
    }

    let {
        open = $bindable(true),
        disabled = false,
        nonDismissable = false,
        title = undefined,
        onClose = function () {},
        actions = [],
        signal = $bindable(undefined),
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
    run(() => {
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
    run(() => {
        registerOnClose(closeModal);
    });
    run(() => {
        registerOnConfirm(confirm);
    });
</script>

<ContentDialog bind:open {title} {...rest} closable={!nonDismissable} on:close={closeModal}>
    <H4>{@render description?.()}</H4>
    {@render children?.()}
    {#if actions.length}
        <div class={cx("Actions")}>
            {#each actions as action}
                <Button
                    props={{ disabled, ...action }}
                    on:click={async () => {
                        if (await action.onClick()) closeModal();
                    }}
                >
                    {action.children}
                </Button>
            {/each}
        </div>
    {/if}
</ContentDialog>
