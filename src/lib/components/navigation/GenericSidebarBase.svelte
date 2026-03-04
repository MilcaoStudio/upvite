<script lang="ts">
    import { css, cx } from "@emotion/css";
    interface Props {
        children?: import('svelte').Snippet;
        [key: string]: any
    }

    let { children, ...rest }: Props = $props();

    const Base = cx("GenericSidebar", css`
        width: 232px;
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        background: var(--secondary-background);
        border-radius: var(--border-radius-inner);
        overflow-x: hidden;
        position: relative;
    `)
</script>

<div class={Base} {...rest}>
    {@render children?.()}
</div>