<script lang="ts">
    import { css } from "@emotion/css";
    import { createEventDispatcher } from "svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";

    export let props: HTMLButtonAttributes & {
        compact?: boolean | 'icon',
        palette?: 
        | "primary"
        | "secondary"
        | "plain"
        | "plain-secondary"
        | "accent"
        | "success"
        | "warning"
        | "error"} = { compact: false, palette: 'primary' }

    const { compact, palette } = props;

    let dispatch = createEventDispatcher();

    $: buttonStyle = css`
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        flex-shrink: 0;
        font-weight: 500;
        font-family: inherit;

        transition: 0.1s ease all;

        border: none;
        cursor: pointer;
        border-radius: var(--border-radius);

        ${compact == 'icon' ? 'height: 38px; width: 38px;' :
                compact ? 'min-width: 96px; font-size: 15px; height: 32px; padding: 2px 12px;' :
                'height: 38px; min-width: 96px; padding: 2px 16px; font-size: 15px;'
        }
        &:disabled {
            cursor: not-allowed;
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
        }})()}`;
    
</script>

<button {...props} on:click={()=>dispatch('click')}>
    <slot />
</button>