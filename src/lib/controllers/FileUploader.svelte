<script lang="ts">
    import {
        grabFiles,
        type BehaviorType,
        uploadFile,
        type StyleType,
    } from "$lib/types/FileUpload";
    import { modalController } from "$lib/components/modals/ModalController";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import BxPencil from "svelte-boxicons/BxPencil.svelte";
    import { determineFileSize, takeError } from "$lib";
    import { cx } from "@emotion/css";
    import { t } from "svelte-i18n";
    import { translate } from "$lib/i18n";
    import IconButton from "$lib/components/atoms/input/IconButton.svelte";
    import Plus from "svelte-boxicons/BxPlus.svelte";
    import { useClient } from "$lib/components/client/ClientContext.svelte";

    const client = useClient();
    interface Props {
        fileType: 
            | "backgrounds"
            | "icons"
            | "avatars"
            | "attachments"
            | "banners"
            | "emojis";
        maxFileSize: number;
        style: StyleType;
        remove: () => Promise<void>;
        behavior: BehaviorType;
    }

    let {
        fileType,
        maxFileSize,
        style,
        remove,
        behavior
    }: Props = $props();
    let uploading = $state(false),
        previewFile: File | null = $state(null),
        previewURL = $state<string>();

    $effect(()=>{
        // free memory
        console.debug(previewURL);
        if (previewURL) {
            URL.revokeObjectURL(previewURL);
        }

        if (previewFile) {
            previewURL = URL.createObjectURL(previewFile);
        }

        return ()=>{
            if (previewURL) {
                URL.revokeObjectURL(previewURL);
                previewURL = undefined;
            }
        }
    });
    function onClick() {
        if (uploading) {
            return;
        }

        grabFiles(
            maxFileSize,
            async (files) => {
                uploading = true;
                try {
                    if (behavior.type == "multi") {
                        behavior.onChange(files);
                    } else if (behavior.type == "ask") {
                        behavior.onChange(files[0]);
                    } else {
                        await behavior.onUpload(
                            await uploadFile(
                                client.configuration!.features.autumn.url,
                                fileType,
                                files[0],
                            ),
                        );
                    }
                } catch (err) {
                    return modalController.push({
                        type: "error",
                        error: takeError(err),
                    });
                } finally {
                    uploading = false;
                }
            },
            () =>
                modalController.push({
                    type: "error",
                    error: "FileTooLarge",
                }),
            behavior.type == "multi",
        );
    }

    function removeOrUpload() {
        if (uploading) return;

        if (style.type == "attachment") {
            if (style.attached) {
                remove();
            } else {
                onClick();
            }
        } else if (style.previewURL || previewFile) {
            if (previewFile) {
                previewFile = null;
            }
            remove();
        } else {
            onClick();
        }
    }

    let paste = $derived(function (e: ClipboardEvent) {
        const items = e.clipboardData?.items;
        if (typeof items == "undefined") return;
        if (behavior.type != "multi" || !behavior.append) return;

        const files = [];
        for (const item of items) {
            if (!item.type.startsWith("text/")) {
                const blob = item.getAsFile();
                if (blob) {
                    if (blob.size > maxFileSize) {
                        modalController.push({
                            type: "error",
                            error: "FileTooLarge",
                        });
                        continue;
                    }

                    files.push(blob);
                }
            }
        }

        behavior.append(files);
    });
    // Let the browser know we can drop files.
    function dragover(e: DragEvent) {
        //e.stopPropagation();
        //e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    }

    // File dropping.
    function drop(e: DragEvent) {
        //e.preventDefault();
        if (behavior.type !== "multi" || !behavior.append) return;

        const dropped = e.dataTransfer?.files;
        if (dropped) {
            const files = [];
            for (const item of dropped) {
                if (item.size > maxFileSize) {
                    modalController.push({
                        type: "error",
                        error: "FileTooLarge",
                    });
                    continue;
                }

                files.push(item);
            }

            behavior.append(files);
        }
    }
</script>

<svelte:document onpaste={paste} ondragover={dragover} ondrop={drop} />

{#if style.type == "icon" || style.type == "banner"}
    <div
        class={cx(
            "uploader",
            { ["icon"]: style.type == "icon" },
            { ["banner"]: style.type == "banner" },
            "flex",
        )}
        style:align-items={style.type == "icon" ? "center" : "none"}
        data-uploading={uploading}
    >
        <button
            class={cx(
                "image",

                style.desaturateDefault && previewURL == null && "desaturate", "button-base"
            )}
            
            style:width={style.width}
            style:height={style.height}
            onclick={onClick}
        >
            {#if uploading}
                <div class="uploading">
                    <Preloader type="ring" />
                </div>
            {:else}
                <div class="edit">
                    <BxPencil size={30} />
                </div>
            {/if}
        </button>
        <div class="small">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <!-- replace to button ? -->
            <span onclick={removeOrUpload}>
                {uploading ? $t("app.main.channel.uploading_file") : style.previewURL || previewFile ?
                    $t("app.settings.actions.remove"): $t("app.settings.actions.upload")
                }
            </span>
            <span class="small">
                {translate("app.settings.actions.max_filesize", {filesize: determineFileSize(maxFileSize)})}
            </span>
        </div>
    </div>
{:else if style.type == "attachment"}
    <IconButton onClick={()=>{
        if (uploading && style.type == "attachment") return style.cancel();
        if (style.type == "attachment" && style.attached) return remove();
        onClick();
    }} rotate={uploading || style.attached ? "45deg" : undefined}>
        <Plus size={style.size} />
    </IconButton>
{/if}


<style>
    .small > span{
        color: var(--secondary-foreground);
        font-weight: 600;
        font-size: 0.876rem;
        margin-right: 16px;
    }
    .flex{
        display: flex;
        flex-direction: row;
        align-items: center;
        transition: all 0.15s ease-in-out;
        gap: 6px;
        padding: 7px;
        border:none;
        border-radius: var(--border-radius);
        color: var(--secondary-foreground);
        background-color: var(--background);
        
    }
    /* Estilo de hover cuando el Item está activo */
    .flex:active{
        background-color: var(--secondary-background) !important;
        color: var(--foreground) !important;  /* Cambia el color del texto */
        filter: none !important;
    }

    .flex:hover{
        background-color: var(--tertiary-background);


    }
    span {
        margin: 0px;
        display: flex;
        color: var(--foreground);
        align-items: center;
    }
</style>
