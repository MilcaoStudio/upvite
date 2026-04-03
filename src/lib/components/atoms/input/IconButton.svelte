<script lang="ts">
    import { css, cx } from "@emotion/css";

    interface Props {
        rotate?: string | null;
        shape?: "default" | "circle" | undefined;
        href?: string | undefined;
        onClick?: any;
        children?: import('svelte').Snippet;
        [key: string]: any
    }

    let {
        rotate = null,
        shape = undefined,
        href = undefined,
        onClick = ()=>{},
        children,
        ...rest
    }: Props = $props();
    const normal = `var(--secondary-foreground)`;
    const hover = `var(--foreground)`;
    const Icon = $derived(cx(
        "IconButton",
        css`
            fill: ${normal};
            color: ${normal};

            a {
                color: ${normal};
            }

            &:hover {
                fill: ${hover};
                color: ${hover};

                a {
                    color: ${hover};
                }
            }
            
            ${rotate &&
            `
            svg {
                transform: rotateZ(${rotate});
            }`}
        `,
    ));
</script>

<a class={[Icon, shape == "circle" && "circle"]} {...rest} {href} onclick={onClick}>
    {@render children?.()}
</a>

<style>
    .IconButton {
        width: fit-content;

        z-index: 1;
        display: grid;
        cursor: pointer;
        place-items: center;

        transition: 0.1s ease all;
            
        border-radius: var(--border-radius-inner);
        padding: 6px;
    }
    :global(svg) {
        transition: 0.2s ease transform;
    }
    .circle {
        padding: 4px;
        border-radius: var(--border-radius-half);
        background-color: var(--secondary-header);
    }
    .circle:hover {
        background-color: var(--primary-header);
    }
</style>