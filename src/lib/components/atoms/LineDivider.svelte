<script lang="ts">
    import { css, cx } from "@emotion/css";

    interface Props {
        palette?: "primary" | "accent";
        compact?: boolean;
        children?: import('svelte').Snippet;
    }

    let { palette = "primary", compact = false, children }: Props = $props();
</script>

<div class={["LineDivider", compact && "compact", palette == "accent" && "accent"]}>
    {@render children?.()}
</div>

<style>
    .LineDivider {
        display: flex;
        user-select: none;
        align-items: center;
        height: 1px;
        width: calc(100% - 10px);
        margin: 18px auto;
        background: var(--secondary-header);
    }
    .LineDivider.compact {
        margin: 6px auto;
    }

    .LineDivider.accent {
        background: var(--accent);
    }
</style>