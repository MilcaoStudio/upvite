<script lang="ts">
    import type { ModalProps } from "$lib/types/Modal";
    import Modal from "./Modal.svelte";
    import { clientController } from "$lib/controllers/ClientController";
    import AttachmentActions from "../messaging/attachments/AttachmentActions.svelte";
    import EmbedActions from "../messaging/embed/EmbedActions.svelte";
    interface Props {
        props: ModalProps<"image_viewer">;
    }

    let { props }: Props = $props();
    let { attachment, embed } = props;
</script>

<Modal {...props}>
    {#snippet override()}
        <div class="view" >
            {#if attachment && attachment.metadata.type == "Image"}
                <img
                    alt={attachment.filename}
                    src={attachment.filename}
                    
                    loading="eager"
                />
                <AttachmentActions {attachment} />
            {:else if embed}
                <img
                    loading="eager"
                    alt={embed.size}
                    src={clientController.availableClient.proxyFile(embed.url)}
                    width={embed.width}
                    height={embed.height}
                />
                <EmbedActions {embed} />
            {:else}
                {console.warn(
                    `Attempted to use a non valid attatchment type in the image viewer: ${attachment?.metadata.type}`,
                )}
            {/if}
        </div>
    {/snippet}
</Modal>

<style>
    .view {
        display: flex;
        flex-direction: column;
        border-radius: var(--border-radius);
    }

    .view img {
        width: auto;
        height: auto;
        max-height: 75vh;
        max-width: 90vw;
        object-fit: contain;
    }
</style>
