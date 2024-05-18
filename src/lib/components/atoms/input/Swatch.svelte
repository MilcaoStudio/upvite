<script lang="ts">
    import { afterUpdate } from "svelte";

    export let hsl: [number, string, string],
        onchange: ((colour: string) => void) | undefined = undefined;
    $: hue = hsl[0] ?? 0;
    $: saturation = hsl[1] ?? "100%";
    $: lightness = hsl[2] ?? "50%";
    let ref: HTMLButtonElement | null = null;
    let colour: string;
    afterUpdate(()=>{
        if (ref) {
            colour = getComputedStyle(ref).backgroundColor;
        }
    });
</script>

<button
    class="Swatch"
    bind:this={ref}
    style:--hue={hue}
    style:--sat={saturation}
    style:--light={lightness}
    on:click={(ev) =>onchange?.(getComputedStyle(ev.currentTarget).backgroundColor)}
>
    <slot {colour} />
</button>

<style>
    .Swatch {
        width: 40px;
        height: 30px;
        background-color: hsl(var(--hue), var(--sat), var(--light));
        border: 2px solid transparent;
        border-radius: var(--border-radius-small);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.1s ease-in-out all;
    }

    .Swatch:hover {
        border: 2px solid var(--foreground);
    }
</style>
