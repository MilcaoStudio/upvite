<script lang="ts">
    import { determineFileSize } from "$lib";
    import { CAN_UPLOAD_AT_ONCE } from "$lib/types/messaging";
    import { onDestroy, onMount } from "svelte";
    import FileIcon from "svelte-boxicons/BxFile.svelte";
    import X from "svelte-boxicons/BxXCircle.svelte";
    import EmptyEntry from "./EmptyEntry.svelte";

    export let file: File,
        remove: (() => void) | null = null,
        index: number;
    let url = "";
    onMount(() => {
        if (file.type.startsWith("image/")) {
            url = URL.createObjectURL(file);
        }
    });
    onDestroy(() => url && URL.revokeObjectURL(url));
</script>

<div class="Entry" class:fade={index >= CAN_UPLOAD_AT_ONCE}>
    <button class="PreviewBox" on:click={remove}>
        {#if file.type.startsWith("image/")}
            <img class="icon" src={url} alt={file.name} loading="eager" />
        {:else}
            <EmptyEntry class="icon">
                <FileIcon size={36} />
            </EmptyEntry>
        {/if}
        <div class="overlay">
            <X size={36} />
        </div>
    </button>
    <span class="fn">{file.name}</span>
    <span class="size">{determineFileSize(file.size)}</span>
</div>

<style>

    .Entry {
        display: flex;
        flex-direction: column;
    }

    .Entry.fade {
        opacity: 0.4;
    }

    .Entry span.fn {
        margin: auto;
        font-size: 0.8em;
        overflow: hidden;
        max-width: 180px;
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: var(--secondary-foreground);
    }

    .Entry span.size {
        font-size: 0.6em;
        color: var(--tertiary-foreground);
        text-align: center;
    }

    .PreviewBox {
        display: grid;
        grid-template: "main" 100px / minmax(100px, 1fr);
        justify-items: center;

        cursor: pointer;
        overflow: hidden;
        border-radius: var(--border-radius);
        background: var(--primary-background);
    }

    .icon {
        height: 100px;
        width: 100%;
        margin-bottom: 4px;
        object-fit: contain;
    }

    .overlay {
        display: grid;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100%;

        opacity: 0;
        visibility: hidden;

        transition: 0.1s ease opacity;
    }

    .icon,
    .overlay {
        grid-area: main;
    }

    .PreviewBox:hover .overlay {
        visibility: visible;
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.8);
    }
</style>
