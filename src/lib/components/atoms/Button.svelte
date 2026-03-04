<script lang="ts">
    import { handlers } from 'svelte/legacy';

    import { css } from "@emotion/css";
    import { createEventDispatcher } from "svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";

    interface Props {
        props?: HTMLButtonAttributes & {
        compact?: boolean | 'icon',
        palette?: 
        | "primary"
        | "secondary"
        | "plain"
        | "plain-secondary"
        | "accent"
        | "success"
        | "warning"
        | "error"};
        palette?: string;
        onClick?: (()=>void) | null;
        children?: import('svelte').Snippet;
        [key: string]: any
    }

    let {
        props = { compact: false, palette: 'primary' },
        palette = $bindable("primary"),
        onClick = null,
        children,
        ...rest
    }: Props = $props();

    const { compact } = props;
    
    palette = palette || props.palette || "primary";

    let dispatch = createEventDispatcher();

    let buttonStyle = $derived(css`
        align-items:center;
        box-sizing:border-box;
        display:inline-flex;
        font-weight:400;
        justify-content:center;
        line-height:20px;
        outline:none;
        padding-block:4px 6px;
        padding-inline:11px;
        position:relative;
        transition:var(--fds-control-faster-duration) ease background;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;

        flex-shrink: 0;
        font-weight: 500;
        font-family: inherit;

        transition: 0.1s ease all;

        border: none;
        cursor: pointer;
        border-radius: var(--fds-control-corner-radius);

        ${compact == 'icon' ? 'height: 38px; width: 38px;' :
                compact ? 'min-width: 96px; font-size: 15px; height: 32px; padding: 2px 12px;' :
                'height: 38px; min-width: 96px; padding: 2px 16px; font-size: 15px;'
        }
        &:disabled {
            cursor: not-allowed;
        }
        &:focus-visible {
            box-shadow:var(--fds-focus-stroke);
        }
        ${(()=>{switch(palette){
            case 'secondary':
            return `
                    font-weight: 500;
                    color: var(--foreground);
                    background: var(--secondary-header);

                    &:hover {
                        background: var(--primary-header);
                    }

                    &:disabled {
                        background: var(--secondary-header);
                    }

                    &:active {
                        background: var(--secondary-background);
                    }
                `;
            case 'plain': case 'plain-secondary':
                return `
                    color: ${palette == "plain"
                        ? "var(--foreground)"
                        : "var(--secondary-foreground)"};
                    background: transparent;

                    &:hover {
                        text-decoration: underline;
                    }

                    &:disabled {
                        opacity: 0.5;
                    }

                    &:active {
                        color: var(--tertiary-foreground);
                    }`
                    case "accent":
            case "success": case "warning": case "error":
                return `
                font-weight: 600;
                    color: var(--${props.palette}-contrast);
                    background: var(--${props.palette});

                    &:hover {
                        filter: brightness(1.2);
                    }

                    &:active {
                        filter: brightness(0.8);
                    }

                    &:disabled {
                        filter: brightness(0.7);
                    }`
            case "primary": default:
                return `font-weight: 500;
                    color: var(--foreground);
                    background: var(--primary-background);

                    &:hover {
                        background: var(--secondary-header);
                    }

                    &:disabled {
                        background: var(--primary-background);
                    }

                    &:active {
                        background: var(--secondary-background);
                    }`
        }})()}`);
    
</script>

<button class={buttonStyle} {...props} onclick={handlers(()=>dispatch('click'), onClick)} {...rest}>
    {@render children?.()}
</button>