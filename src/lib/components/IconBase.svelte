<script lang="ts">
    import { css, cx } from "@emotion/css";

    export let borderRadius = '--border-radius', hover = false;
    export let ref: SVGElement | null = null;
    const IconBase = cx('IconBase', css`
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

<svg class={IconBase} bind:this={ref} {...$$restProps} >
    <slot />
</svg>