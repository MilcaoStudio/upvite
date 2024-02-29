<script lang="ts">
    import { css, cx } from "@emotion/css";

    export let palette: "primary" | "accent" = "primary", compact = false;
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
    <slot />
</div>