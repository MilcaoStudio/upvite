<script lang="ts">
    import { css, cx } from "@emotion/css";

    export let borderRadius = '--border-radius', hover = false, onClick: ((e: MouseEvent)=>void) | null = null;
    export let ref: SVGElement | null = null;
    let className = "";
    export {className as class};
    const IconBase = cx('IconBase', className, css`
    flex-shrink: 0;
    cursor: pointer;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        


        ${borderRadius ? `border-radius: var(${borderRadius});` : ``}

        ${hover ? `&:hover .icon { filter: brightness(0.8); }` : ``}
        
    }
    `)
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<svg class={IconBase} role="img" bind:this={ref} on:click={onClick} {...$$restProps} >
    <slot />
</svg>