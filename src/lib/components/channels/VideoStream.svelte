<script lang="ts">
    import { afterUpdate } from "svelte";
    import Column from "../atoms/layout/Column.svelte";

    export let srcObject: MediaStream | null = null, video = false, muted = false;
    let ref: HTMLVideoElement | null;

    afterUpdate(() => {
        if (ref) {
            ref.srcObject = srcObject;
        }
        console.info("Stream ID:", srcObject?.id);
    });
</script>

<Column>
{#if video}
    <!-- svelte-ignore a11y-media-has-caption -->
    <video id={srcObject?.id} {muted} autoplay bind:this={ref} />
{/if}
</Column>

<style>
    video {
        width: 360px;
        height: 200px;
        border-radius: var(--border-radius-inner);
        
    }

</style>
