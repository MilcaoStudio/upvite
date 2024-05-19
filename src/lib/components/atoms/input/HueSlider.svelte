<script lang="ts">
    export let onchange: ((value: number)=>void) | undefined = undefined, value = 0;
</script>


<div class="HueSlider">
    <label><slot/></label>
    <div>
        <input type="range" min="0" max="360" step="1" bind:value on:change={()=>onchange?.(value)} {...$$restProps} />
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