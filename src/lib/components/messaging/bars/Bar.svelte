<script lang="ts">
    import { isTouchscreenDevice } from "$lib";
    import { css, cx } from "@emotion/css";

    export let position: "top" | "bottom", accent = false;
    const Bar = cx('Bar', css`
        z-index: 1;
        position: relative;

        ${position == "top" ? `
            top: 0;
            animation: topBounce 340ms cubic-bezier(0.2, 0.9, 0.5, 1.16) forwards;
            ` : `
            top: -28px;
            animation: bottomBounce 340ms cubic-bezier(0.2, 0.9, 0.5, 1.16) forwards;
            ${isTouchscreenDevice ? ` top: -90px;` : ``}`}
        
        @keyframes bottomBounce {
            0% {
                transform: translateY(33px);
            }
            100% {
                transform: translateY(0px);
            }
        }

        @keyframes topBounce {
            0% {
                transform: translateY(-33px);
            }
            100% {
                transform: translateY(0px);
            }
        }
        
        > button {
            height: 28px;
            width: 100%;
            position: absolute;
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            padding: 0 8px;
            user-select: none;
            justify-content: space-between;
            transition: color ease-in-out 0.08s;

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            ${accent ? `
                color: var(--accent-contrast);
                background-color: rgba(var(--accent-rgb),
                    max(var(--min-opacity), 0.9)
                );
                backdrop-filter: blur(20px);` : `
                color: var(--secondary-foreground);
                background-color: rgba(
                    var(--secondary-background-rgb),
                    max(var(--min-opacity), 0.9)
                );
                backdrop-filter: blur(20px);
            `}
            
            ${position == "top" ? `
                top: 48px;
                border-radius: 0 0 var(--border-radius) var(--border-radius);` : `
                border-radius: var(--border-radius) var(--border-radius) 0 0;
            `}

            > div {
                display: flex;
                align-items: center;
                gap: 6px;

                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            &:hover {
                color: var(--primary-text);
            }

            &:active {
                transform: translateY(1px);
            }
            ${isTouchscreenDevice ? `height: 34px; padding: 0 12px;` : ``}
        }
        @media only screen and (max-width: 800px) {
            .right > span {
                display: none;
            }
        }
    `);
</script>

<div class={Bar}><slot /></div>