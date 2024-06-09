<script lang="ts">
    import { takeError } from "$lib";
    import { modalController } from "$lib/components/modals/ModalController";
    import { grabFiles } from "$lib/types/FileUpload";
    export let onChange: ((file: File) => void) | null = null,
        accept = "*",
        maxFileSize = 5_000;

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
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
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
    on:paste={paste}
    on:dragover|preventDefault|stopPropagation={dragover}
    on:drop|preventDefault={drop}
/>

<button class="flex-button" on:click={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-upload">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
        <path d="M7 9l5 -5l5 5" />
        <path d="M12 4l0 12" />
      </svg>
    
    <slot><span>Import from file</span></slot>
</button>

<style>

</style>
