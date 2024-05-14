<script lang="ts">
    import { goto } from "$app/navigation";
    import { state } from "$lib/State";
    import { modalController } from "$lib/components/modals/ModalController";

    let closing = false;
    function exitSettings() {
        closing = true;
        setTimeout(() => goto(state.layout.getLastPath()), 200);
    }

    function keyDown(ev: KeyboardEvent) {
        if (ev.key == "Escape") {
            if (modalController.isVisible) return;
            exitSettings();
        }
    }
</script>

<svelte:body on:keydown={keyDown} />

<div class="baseCloseButton">
    <button
        class="close"
        on:click={() => {
            exitSettings();
        }}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-x"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#ef4444"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </svg>
    </button>
</div>

<style>
    .baseCloseButton {
        right: 0px;
        height: 100vh;
        width: 64px;
        background-color: var(--secondary-background);
        max-width: 650px;
        display: flex;
        flex: 1 1 64px;
        flex-direction: column;
        align-items: stretch;
    }

    .close {
        background-color: var(--background);
        width: 38px;
        height: 38px;
        margin: 16px;
        border-radius: var(--border-radius-half);
        border: solid 2px var(--tertiary-foreground);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.12s all ease-in;
    }
    .close:hover {
        background-color: var(--primary-header);
    }
    .close:active {
        background-color: var(--background-dark);
    }
    .close:hover svg {
        stroke: var(--foreground);
    }
    .close svg {
        width: 32px;
        height: 32px;
        stroke: var(--tertiary-foreground);
    }
</style>
