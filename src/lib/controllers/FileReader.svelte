<script lang="ts">
    import { takeError } from "$lib";
    import { modalController } from "$lib/components/modals/ModalController";
    import { grabFiles } from "$lib/types/FileUpload";
    import Import from "svelte-boxicons/BxDownload.svelte";
    export let onChange: ((file: File)=>void) | null = null, accept = "*", maxFileSize = 5_000;

    function onClick() {
        grabFiles(maxFileSize, (files)=>{
            try {
                onChange?.(files[0])
            } catch (err) {
                return modalController.push({
                    type: "error",
                    error: takeError(err),
                });
            } finally {

            }
        }, () =>
        modalController.push({
            type: "error",
            error: "FileTooLarge",
        }), false, accept)
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

<svelte:document on:paste={paste} on:dragover|preventDefault|stopPropagation={dragover} on:drop|preventDefault={drop} />

<button class="import" on:click={onClick}>
    <Import size={16} /> Importar
</button>

<style>
    .import {
        max-width: 150px;
        border-radius: 8px;
        background-color: green;
    }
</style>