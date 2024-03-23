<script lang="ts">
    import { modalController } from "$lib/components/modals/ModalController";
    import { useClient } from "$lib/controllers/ClientController";
    import { ImageState } from "$lib/types/messaging";
    import { cx } from "@emotion/css";
    import type { API } from "revolt.js";

    export let attachment: API.File;
    const client = useClient();
    let loading = ImageState.Loading;
    let url = client.generateFileURL(attachment);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<img
    alt={attachment.filename}
    class={cx("image", { loading: loading != ImageState.Loaded})}
    src={url}
    loading="lazy"
    on:click={() => modalController.push({ type: "image_viewer", attachment })}
    on:mousedown={(ev) => ev.button == 1 && window.open(url, "blank_")}
    on:error={() => ImageState.Error}
    on:load={() => ImageState.Loaded}
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