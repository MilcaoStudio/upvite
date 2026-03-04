<script lang="ts">
    import { preventDefault, stopPropagation } from 'svelte/legacy';

    import { takeError } from "$lib";
    import { modalController } from "$lib/components/modals/ModalController";
    import { grabFiles } from "$lib/types/FileUpload";
    import Import from "svelte-boxicons/BxUpload.svelte";
    interface Props {
        onChange?: ((file: File) => void) | null;
        accept?: string;
        maxFileSize?: number;
        children?: import('svelte').Snippet;
    }

    let {
        onChange = null,
        accept = "*",
        maxFileSize = 5_000,
        children
    }: Props = $props();

    function onClick() {
        grabFiles(
            maxFileSize,
            (files) => {
                try {
                    onChange?.(files[0]);
                } catch (err) {
                    return modalController.push({
                        type: "error",
                        error: takeError(err),
                    });
                } finally {
                }
            },
            () =>
                modalController.push({
                    type: "error",
                    error: "FileTooLarge",
                }),
            false,
            accept,
        );
    }

    // Let the browser know we can drop files.
    function dragover(e: DragEvent) {
        if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    }
    // File dropping.
    function drop(e: DragEvent) {
        const dropped = e.dataTransfer?.files;
        if (dropped) {
            const item = dropped[0];
            if (item.size > maxFileSize) {
                modalController.push({
                    type: "error",
                    error: "FileTooLarge",
                });
            }
            onChange?.(item);
        }
    }
    function paste(e: ClipboardEvent) {
        const items = e.clipboardData?.items;
        let file = null;
        if (items) {
            for (const item of items) {
                if (item.type.startsWith("text/")) {
                    const blob = item.getAsFile();
                    if (blob) {
                        if (blob.size > maxFileSize) {
                            modalController.push({
                                type: "error",
                                error: "FileTooLarge",
                            });
                            continue;
                        }
                        file = blob;
                    }
                    break;
                }
            }
            if (file) {
                onChange?.(file);
            }
        }
    }
</script>

<svelte:document
    onpaste={paste}
    ondragover={stopPropagation(preventDefault(dragover))}
    ondrop={preventDefault(drop)}
/>

<button class="flex-button" onclick={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-upload">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
        <path d="M7 9l5 -5l5 5" />
        <path d="M12 4l0 12" />
      </svg>
    
    {#if children}{@render children()}{:else}<span>Import from file</span>{/if}
</button>

<style>

</style>
