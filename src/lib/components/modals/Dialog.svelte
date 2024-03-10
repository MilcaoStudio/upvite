<!--Experimental: Replace Modal by ContentDialog-->
<script lang="ts">
    import type { Action } from "$lib/types/Modal";
    import { ContentDialog } from "fluent-svelte";
    import H4 from "../atoms/heading/H4.svelte";
    import { cx } from "@emotion/css";
    import Button from "../atoms/Button.svelte";
    export let open = true,
        disabled = false,
        nonDismissable = false,
        title: string | undefined = undefined,
        onClose: (force: boolean) => void = function () {},
        actions: Action[] = [],
        signal: "close" | "confirm" | "force" | undefined = undefined,
        registerOnClose: (fn: () => void) => () => void = (fn) => fn,
        registerOnConfirm: (fn: () => void) => () => void = (fn) => fn;
    $: closeModal = function () {
        if (open) {
            setTimeout(function () {
                onClose(true);
            }, 200);
        }
        open = false;
        console.log("[closeModal] Closing modal");
    };
    $: {
        if (signal == "confirm") {
            confirm();
        } else if (signal) {
            const cannotClose = signal == "close" && nonDismissable;
            if (!cannotClose) {
                closeModal();
            }
        }
    }
    async function confirm() {
        if (await actions.find((x) => x.confirmation)?.onClick?.()) {
            closeModal();
            console.log("[confirm] Closing modal");
        }
    }
    $: registerOnClose(closeModal);
    $: registerOnConfirm(confirm);
</script>

<ContentDialog {open} {title} {...$$restProps}>
    <H4><slot name="description" /></H4>
    <slot />
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
