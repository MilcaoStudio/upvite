<script lang="ts">
    import { css, cx } from "@emotion/css";

    export let palette: "primary" | "secondary" = "primary",
        withTransparency = false,
        withBackground = false,
        topBorder = false,
        bottomBorder = false;
    const style = cx(
        "Header",
        css`
            ${withTransparency
                ? ` 
                    -webkit-backdrop-filter: blur(10px);
                    backdrop-filter: blur(20px);
                    width: calc(100% - 20px);
                    z-index: 20;
                    position: absolute;
                    background-color: rgba( 56, 64, 93, max(0, 0.3) );
                };
              `
                : `background-color: var(--${palette}-header);`}
            ${withBackground
                ? `align-items: flex-end;
            height: 120px !important;
            text-shadow: 0px 0px 1px black;`
                : ``}
        ${topBorder ? `border-start-start-radius: 8px;` : ``}
        ${bottomBorder ? ` border-end-start-radius: 8px;` : ``}
        `,
    );
</script>

<style>
    div.Header {
        gap: 10px;
        display: flex;
        flex-shrink: 1;
        padding: 6px 8px;
        margin: 6px 8px;
        border-radius: var(--border-radius-inner);
        font-weight: 600;
        user-select: none;
        height: var(--header-height);
        color: var(--foreground);
        background-size: cover !important;
        background-position: center !important;
        align-items: center;
    }
    
    div.Header :global(svg) {
        flex-shrink: 0;
    }
</style>

<div class={style}>
    <slot />
</div>