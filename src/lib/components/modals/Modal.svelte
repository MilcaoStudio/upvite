<script lang="ts">
    import type { Action } from "$lib/types/Modal";
    import { noop } from "mobx/dist/internal";
    import H2 from "../atoms/heading/H2.svelte";
    import H4 from "../atoms/heading/H4.svelte";
    import Button from "../atoms/Button.svelte";

    export let padding: string = '',
    maxWidth: string = '',
    maxHeight: string = '',
    disabled = false,
    transparent = false,
    nonDismissable = false,
    actions: Action[] = [],
    onClose: (force: boolean)=>void = noop,
    signal: "close" | "confirm" | "force"| undefined = undefined,
    registerOnClose: (fn: () => void) => () => void = (fn)=>fn,
    registerOnConfirm: (fn: () => void) => () => void = (fn)=>fn;
    
    let closing = false;
    const css = `<style>
        .Base {
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99;
            position: fixed;
            max-height: 100%;
            user-select: none;
            animation-duration: 0.2s;
            animation-fill-mode: forwards;
            display: grid;
            overflow-y: auto;
            place-items: center;
            color: var(--foreground);
            background: rgba(0, 0, 0, 0.8);
            ${closing ? 'animation-name: fadeOut' : 'animation-name: fadeIn'}
        }
        .Base > div {
            ${closing && 'animation-name: zoomOut'}
        }
        .Container {
            min-height: 200px;
            max-width: min(calc(100vw - 20px), ${maxWidth ?? "450px"});
            max-height: min(calc(100vh - 20px), ${maxHeight ?? "650px"});
            margin: 20px;
            display: flex;
            flex-direction: column;
            animation: zoomIn 0.25s cubic-bezier(0.3, 0.3, 0.18, 1.1);
            ${!maxWidth && 'width: 100%;'}
            ${!transparent && 'overflow: hidden; background: var(--secondary-header); border-radius: var(--border-radius);'}
        }
        .Title {
            padding: 1rem;
            flex-shrink: 0;
            word-break: break-word;
            gap: 8px;
            display: flex;
            flex-direction: column;
        }
        .Content {
            flex-grow: 1;
            padding-top: 0;
            padding: ${padding ?? "0 1rem 1rem"};
            overflow-y: auto;
            font-size: 0.9375rem;
            display: flex;
            flex-direction: column;
            ${!transparent && 'background: var(--secondary-header);'}
        }
        .Actions {
            flex-shrink: 0;
            gap: 8px;
            display: flex;
            padding: 1rem;
            flex-direction: row-reverse;
            background: var(--secondary-background);
            border-radius: 0 0 var(--border-radius) var(--border-radius);
        }
    </style>`;

    $: closeModal = function(){
        if (!closing) {
            setTimeout(function(){ onClose(true) }, 200)
        }
        closing = true;
        console.log('[closeModal] Closing modal');
    }

    async function confirm(){
        if(await actions.find(x => x.confirmation)?.onClick?.()){
            closeModal();
            console.log('[confirm] Closing modal');
        }
    }

    $: registerOnClose(closeModal);
    $: registerOnConfirm(confirm);

    $: {
        if (signal == 'confirm') {
            confirm();
        } else if (signal) {
            const cannotClose = signal == 'close' && nonDismissable;
            if (!cannotClose) {
                closeModal();
            }
        }
    }
    
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="Base" role="dialog" on:click={()=> !nonDismissable && closeModal()} on:keydown={()=> !nonDismissable && closeModal()}>
    <div class="Container" role="none" on:click|stopPropagation on:keydown|stopPropagation >
            <div class="Title">
                <H2><slot name="title" /></H2>
                <H4><slot name="description" /></H4>
            </div>
        <div class="Content"><slot /></div>
        {#if actions.length}
            <div class="Actions">
                {#each actions as action}
                    <Button props={{disabled, ...action}} on:click={async()=>{ if (await action.onClick()) closeModal()}}>
                        {action.children}
                    </Button>
                {/each}
            </div>
        {/if}
    </div>
</div>

{@html css}