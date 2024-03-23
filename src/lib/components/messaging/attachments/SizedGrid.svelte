<script lang="ts">
    import { css, cx } from "@emotion/css";

    export let width: number, height: number, className = "";
    const Grid = cx("Grid", className, css`
        --width: ${width}px;
        --height: ${height}px;
        display: grid;
        overflow: hidden;
        aspect-ratio: ${width}/${height};
        max-width: min(var(--width), var(--attachment-max-width));
        max-height: min(var(--height), var(--attachment-max-height));
        img, video {
            grid-area: 1 / 1;
            display: block;
            max-width: 100%;
            max-height: 100%;
            overflow: hidden;
            object-fit: contain;

            // It's something
            object-position: left;
        }
        video {
            width: 100%;
            height: 100%;
        }

        &.spoiler {
            img, video {
                filter: blur(44px);
            }

            border-radius: var(--border-radius);
        }
    `, css`
    // This is a hack for browsers not supporting aspect-ratio.
    // Stolen from https://codepen.io/una/pen/BazyaOM.
    @supports not (
        aspect-ratio: ${width} / ${height}
    ) {
        div::before {
            float: left;
            padding-top: ${(height / width) * 100}%;
            content: "";
        }

        div::after {
            display: block;
            content: "";
            clear: both;
        }
    }
    `);
</script>

<div class={Grid}>
    <slot />
</div>