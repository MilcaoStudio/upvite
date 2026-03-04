<script lang="ts">
    interface Props {
        onchange?: ((value: number)=>void) | undefined;
        value?: number;
        children?: import('svelte').Snippet;
        [key: string]: any
    }

    let { onchange = undefined, value = $bindable(0), children, ...rest }: Props = $props();
</script>


<div class="HueSlider">
    <label>{@render children?.()}</label>
    <div>
        <input type="range" min="0" max="360" step="1" bind:value onchange={()=>onchange?.(value)} {...rest} />
    </div>
</div>

<style>
    .HueSlider div {
        background: linear-gradient(90deg, hsl(0, 100%, 50%), hsl(45, 100%, 50%), hsl(90, 100%, 50%), hsl(180, 100%, 50%), hsl(270, 100%, 50%),  hsl(360, 100%, 50%));
        display: inline;
    }

    input::-moz-range-progress, input::-ms-track {
        background: transparent;
    }
</style>