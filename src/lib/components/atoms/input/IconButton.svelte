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
    const Icon = cx(
        "IconButton",
        css`
            width: fit-content;

            z-index: 1;
            display: grid;
            cursor: pointer;
            place-items: center;

            transition: 0.1s ease all;
            //background: var(--secondary-header);
            border-radius: var(--border-radius-inner);
            padding: 6px;

            svg {
                transition: 0.2s ease transform;
            }

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
            ${shape == "circle" &&
            `
            padding: 4px;
            border-radius: var(--border-radius-half);
            background-color: var(--secondary-header);

            &:hover {
                background-color: var(--primary-header);
            }
        `}
            ${rotate &&
            `
            svg {
                transform: rotateZ(${rotate});
            }`}
        `,
    );
</script>

<a class={Icon} {...rest} {href} onclick={onClick}>
    {@render children?.()}
</a>
