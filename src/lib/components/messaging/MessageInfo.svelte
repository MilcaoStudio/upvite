<script lang="ts">
    import { css, cx } from "@emotion/css";

    export let click = false, showAlways = false;
    const Info = cx('MessageInfo', css`
        width: 62px;
        display: flex;
        flex-shrink: 0;
        padding-top: 2px;
        flex-direction: row;
        justify-content: center;

        > svg {
            user-select: none;
            cursor: pointer;
            
            &:active {
                transform: translateY(1px);
            }
        }

        .copyBracket {
            opacity: 0;
            position: absolute;
        }

        .copyTime {
            opacity: 0;
            position: absolute;
        }

        time, .edited {
            margin-top: 1px;
            cursor: default;
            display: inline;
            font-size: 10px;
            color: var(--tertiary-foreground);
        }

        time, .edited > div {
            &::selection {
                background-color: transparent;
                color: var(--tertiary-foreground);
            }
        }

        .header {
            cursor: pointer;
        }

        .systemIcon {
            height: 1.33em;
            width: 1.33em;
            margin-right: 0.5em;
            color: var(--tertiary-foreground);
        }
        ${click ? `cursor: pointer;` : ``}`, !showAlways && css`
        &:hover time { opacity: 1; }
        time { opacity: 0; }`);
</script>

<div class={Info}>
    <slot />
</div>