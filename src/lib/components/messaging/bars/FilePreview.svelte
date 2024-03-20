<script lang="ts">
    import { CAN_UPLOAD_AT_ONCE, type UploadState } from "$lib/types/messaging";
    import EmptyEntry from "./EmptyEntry.svelte";
    import FileEntry from "./FileEntry.svelte";
    import Plus from "svelte-boxicons/BxPlus.svelte";
    import Share from "svelte-boxicons/BxShare.svelte";
    import X from "svelte-boxicons/BxX.svelte";
    import { t } from "svelte-i18n";

    export let state: UploadState,
        addFile: () => void,
        removeFile: (index: number) => void;
</script>

{#if state.type != "none"}
    <div class="FilePreview">
        <div class="Carousel">
            {#each state.files as file, index}
                {#if index == CAN_UPLOAD_AT_ONCE}
                    <div class="divider" />
                {/if}
                <FileEntry
                    {index}
                    {file}
                    remove={state.type == "attached"
                        ? () => removeFile(index)
                        : null}
                />
            {/each}
            {#if state.type == "attached"}
                <EmptyEntry onClick={addFile}>
                    <Plus size={48} />
                </EmptyEntry>
            {/if}
        </div>
        {#if state.type == "uploading"}
            <div class="description">
                <Share size={24} />
                {$t("app.main.channel.uploading_file")} ({state.percent}%)
            </div>
        {:else if state.type == "sending"}
            <div class="description">
                <Share size={24} />
                Sending...
            </div>
        {:else if state.type == "failed"}
            <div class="description">
                <X size={24} />
                {$t(`error.${state.error}`)}
            </div>
        {/if}
    </div>
{/if}

<style>
    .FilePreview {
        gap: 4px;
        padding: 8px;
        display: flex;
        user-select: none;
        flex-direction: column;
        background: var(--message-box);
    }
    .Carousel {
        gap: 8px;
        display: flex;
        overflow-x: scroll;
        flex-direction: row;
    }

    .description {
        gap: 4px;
        display: flex;
        font-size: 0.9em;
        align-items: center;
        color: var(--secondary-foreground);
    }

    .divider {
        width: 4px;
        height: 130px;
        flex-shrink: 0;
        border-radius: var(--border-radius);
        background: var(--tertiary-background);
    }
</style>
