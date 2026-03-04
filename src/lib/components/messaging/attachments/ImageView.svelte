<script lang="ts">
    import { modalController } from "$lib/components/modals/ModalController";
    import { ImageState } from "$lib/types/messaging";
    import { cx } from "@emotion/css";
    import type { File } from "stoat.js";

    interface Props {
        attachment: File;
        src?: string;
    }

    let { attachment, src = "" }: Props = $props();
    let loading = $state(ImageState.Loading);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<img
    alt={attachment.filename}
    class={cx("image", { loading: loading != ImageState.Loaded})}
    {src}
    loading="lazy"
    onclick={() => modalController.push({ type: "image_viewer", attachment })}
    onmousedown={(ev) => ev.button == 1 && window.open(src, "blank_")}
    onerror={() => loading = ImageState.Error}
    onload={() => loading = ImageState.Loaded}
/>


<style>
    .image {
        cursor: pointer;
        height: 100%;
        border-radius: var(--border-radius);
    }

    .image.loading {
        background: var(--background);
    }
</style>