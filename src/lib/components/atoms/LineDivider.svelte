<script lang="ts">
    import { css, cx } from "@emotion/css";

    interface Props {
        palette?: "primary" | "accent";
        compact?: boolean;
        children?: import('svelte').Snippet;
    }

    let { palette = "primary", compact = false, children }: Props = $props();
    const Line = cx("LineDivider", css`
        display: flex;
        user-select: none;
        align-items: center;
        height: 1px;
        width: calc(100% - 10px);
        margin: ${compact ? "6px" : "18px"} auto;
        background: ${palette == "accent" ? "var(--accent)" : "var(--secondary-header)"};
    `);
</script>

<div class={Line}>
    {@render children?.()}
</div>