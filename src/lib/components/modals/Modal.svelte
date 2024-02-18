<script lang="ts">
    import type { Action } from "$lib/types/Modal";
    import H2 from "../atoms/heading/H2.svelte";
    import H4 from "../atoms/heading/H4.svelte";
    import Button from "../atoms/Button.svelte";
    import { css, cx } from "@emotion/css";

    export let padding: boolean = true,
        maxWidth: string = "",
        maxHeight: string = "",
        disabled = false,
        transparent = false,
        nonDismissable = false,
        actions: Action[] = [],
        onClose: (force: boolean) => void = function () {},
        signal: "close" | "confirm" | "force" | undefined = undefined,
        registerOnClose: (fn: () => void) => () => void = (fn) => fn,
        registerOnConfirm: (fn: () => void) => () => void = (fn) => fn;

    let closing = false;
    const Base = cx('Base',css`
        ${closing ? "animation-name: fadeOut" : "animation-name: fadeIn"}

        > div {
            ${closing ? "animation-name: zoomOut" : ""}
        }
    `);

    const Container = cx('Container', css`
        max-width: min(calc(100vw - 20px), ${maxWidth || "450px"});
        max-height: min(calc(100vh - 20px), ${maxHeight || "650px"});
        ${!maxWidth ? "width: 100%;" : ""}
        ${!transparent
            ? "overflow: hidden; background: var(--secondary-header); border-radius: var(--border-radius);"
            : ""}
    `);
    const Title = cx('Title');
    const Content = cx('Content', css`
        padding: ${padding ? "0 1rem 1rem" : ""};
        ${!transparent ? "background: var(--secondary-header);" : ""}
    `);
    const Actions = cx('Actions');

    $: closeModal = function () {
        if (!closing) {
            setTimeout(function () {
                onClose(true);
            }, 200);
        }
        closing = true;
        console.log("[closeModal] Closing modal");
    };

    async function confirm() {
        if (await actions.find((x) => x.confirmation)?.onClick?.()) {
            closeModal();
            console.log("[confirm] Closing modal");
        }
    }

    $: registerOnClose(closeModal);
    $: registerOnConfirm(confirm);

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
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
    class={Base}
    role="dialog"
    on:click={() => !nonDismissable && closeModal()}
    on:keydown={() => !nonDismissable && closeModal()}
>
    <div
        class={Container}
        role="none"
        on:click|stopPropagation
        on:keydown|stopPropagation
    >
        <div class={Title}>
            <H2><slot name="title" /></H2>
            <H4><slot name="description" /></H4>
        </div>
        <div class={Content}><slot /></div>
        {#if actions.length}
            <div class={Actions}>
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
    </div>
</div>
