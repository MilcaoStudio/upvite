<script>
    import { css, cx } from "@emotion/css";

    export let head = false,
        fail = false,
        preview = false;
    const Base = cx(
        css`
            .content {
                max-height: 32px;

                gap: 4px;
                display: flex;
                padding: 2px 0;
                cursor: pointer;
                overflow: hidden;
                align-items: center;
                flex-direction: row;

                transition: filter 1s ease-in-out;
                transition: transform ease-in-out 0.1s;
                filter: brightness(1);

                > svg {
                    flex-shrink: 0;
                }

                > span > p {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                &:hover {
                    filter: brightness(2);
                }

                &:active {
                    transform: translateY(1px);
                }

                > * {
                    pointer-events: none;
                }
            }
        `,
        fail &&
            css`
                color: var(--tertiary-foreground);
            `,
        head &&
            css`
                margin-top: 12px;
                &::before {
                    border-start-start-radius: 4px;
                }
            `,
        preview &&
            css`
                margin-left: 0;
            `,
    );
</script>

<div class="Reply {Base}">
    <slot />
</div>

<style>
    .Reply {
        gap: 8px;
        min-width: 0;
        display: flex;
        margin-inline-start: 30px;
        margin-inline-end: 12px;
        font-size: 0.8em;
        user-select: none;
        align-items: end;
        color: var(--secondary-foreground);
    }

    .Reply::before {
        content: "";
        flex-shrink: 0;
        width: 22px;
        height: 10px;
        border-inline-start: 2px solid var(--message-box);
        border-top: 2px solid var(--message-box);
        align-self: flex-end;
    }
    
    .Reply > :global(svg:first-child) {
        flex-shrink: 0;
        transform: scaleX(-1);
        color: var(--tertiary-foreground);
    }
</style>
