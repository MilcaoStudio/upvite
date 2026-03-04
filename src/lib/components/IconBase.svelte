<script lang="ts">
    import { css, cx } from "@emotion/css";

    interface Props {
        borderRadius?: string;
        hover?: boolean;
        onClick?: ((e: MouseEvent)=>void) | null;
        ref?: SVGElement | null;
        class?: string;
        children?: import('svelte').Snippet;
        [key: string]: any
    }

    let {
        borderRadius = '--border-radius',
        hover = false,
        onClick = null,
        ref = $bindable(null),
        class: className = "",
        children,
        ...rest
    }: Props = $props();
    
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

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<svg class={IconBase} role="img" bind:this={ref} onclick={onClick} {...rest} >
    {@render children?.()}
</svg>