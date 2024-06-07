<script lang="ts">
    import { afterUpdate } from "svelte";

    export let srcObject: MediaStream | null = null, video = false;
    let ref: HTMLVideoElement | null;
    afterUpdate(() => {
        if (ref) {
            ref.srcObject = srcObject;
        }
    });
</script>

    {#if video}
        <!-- svelte-ignore a11y-media-has-caption -->
    <video autoplay muted bind:this={ref} />
    {:else}
        <div class="stream">
{srcObject?.id}
        </div>
        
    {/if}

<style>
    video, .stream {
        width: 360px;
        height: 200px;
        border-radius: var(--border-radius-inner);
        
    }

    div.stream {
        background-color: var(--secondary-background);
    }
</style>
