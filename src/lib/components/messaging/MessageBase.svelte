<script lang="ts">
    import { isTouchscreenDevice } from "$lib";
    import { css, cx } from "@emotion/css";
    import type { Snippet } from "svelte";

    interface Props {
        head?: boolean;
        failed?: boolean;
        mention?: boolean;
        blocked?: boolean;
        sending?: boolean;
        contrast?: boolean;
        highlight?: boolean;
        onMouseEnter?: (() => void) | null;
        onMouseLeave?: (() => void) | null;
        onContextMenu?: (() => void) | null;
        children?: Snippet;
    }

    let {
        head = false,
        failed = false,
        mention = false,
        blocked = false,
        sending = false,
        contrast = false,
        highlight = false,
        onMouseEnter = null,
        onMouseLeave = null,
        onContextMenu = null,
        children
    }: Props = $props();
    const Base = $derived(cx(
        "Message",
        css`
            display: flex;
            overflow: none;
            padding: 0.125rem;
            flex-direction: row;
            padding-inline-end: 16px;
            align-items: flex-start;
            ${isTouchscreenDevice() ? `user-select: none;` : ``}
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

                .system-message-icon {
                    display: none;
                }
            }
        `,
    ));
</script>

<div
    class={Base}
    role="listitem"
    onmouseenter={onMouseEnter}
    onmouseleave={onMouseLeave}
    oncontextmenu={onContextMenu}
>
    {@render children?.()}
</div>
