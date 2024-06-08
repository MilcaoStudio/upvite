<script lang="ts">
    import { modalController } from "$lib/components/modals/ModalController";
    import { ImageState } from "$lib/types/messaging";
    import { cx } from "@emotion/css";
    import type { File } from "revolt.js";

    export let attachment: File, src = "";
    let loading = ImageState.Loading;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<img
    alt={attachment.filename}
    class={cx("image", { loading: loading != ImageState.Loaded})}
    {src}
    loading="lazy"
    on:click={() => modalController.push({ type: "image_viewer", attachment })}
    on:mousedown={(ev) => ev.button == 1 && window.open(src, "blank_")}
    on:error={() => loading = ImageState.Error}
    on:load={() => loading = ImageState.Loaded}
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