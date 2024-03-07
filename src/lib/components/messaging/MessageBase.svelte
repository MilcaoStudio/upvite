<script lang="ts">
    import { isTouchscreenDevice } from "$lib";
    import { css, cx } from "@emotion/css";

    export let head = false,
        failed = false,
        mention = false,
        blocked = false,
        sending = false,
        contrast = false,
        highlight = false,
        onMouseEnter: (() => void) | null = null,
        onMouseLeave: (() => void) | null = null,
        onContextMenu: (() => void) | null = null;
    const Base = cx(
        "Message",
        css`
            display: flex;
            overflow: none;
            padding: 0.125rem;
            flex-direction: row;
            padding-inline-end: 16px;
            ${isTouchscreenDevice ? `user-select: none;` : ``}
            ${contrast
                ? `
            padding: 0.3rem;
            background: var(--hover);
            border-radius: var(--border-radius);
            `
                : ``}
        ${head ? `margin-top: 12px;` : ``}
        ${mention ? ` background: var(--mention);` : ``}
        ${blocked
                ? `filter: blur(4px);
            transition: 0.2s ease filter;

            &:hover {
                filter: none;
            }`
                : ``}
        ${sending
                ? `
            opacity: 0.8;
            color: var(--tertiary-foreground);
            `
                : ``}
        ${failed ? `color: var(--error);` : ``}
        ${highlight ? `animation: highlight ease 3s;` : ``}

        .detail {
                gap: 8px;
                display: flex;
                align-items: center;
                flex-shrink: 0;
            }

            .author {
                overflow: hidden;
                cursor: pointer;
                font-weight: 600 !important;

                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                text-overflow: ellipsis;
                white-space: normal;

                &:hover {
                    text-decoration: underline;
                }
            }

            .copy {
                display: block;
                overflow: hidden;
            }

            &:hover {
                background: var(--hover);

                time {
                    opacity: 1;
                }

                .system-message-icon {
                    display: none;
                }
            }
        `,
    );
</script>

<div
    class={Base}
    role="listitem"
    on:mouseenter={onMouseEnter}
    on:mouseleave={onMouseLeave}
    on:contextmenu={onContextMenu}
>
    <slot />
</div>
