<script lang="ts">
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
    const compactCSS = `<style>
        button {
            ${compact == 'icon' ? 'height: 38px; width: 38px;' :
                compact ? 'min-width: 96px; font-size: 15px; height: 32px; padding: 2px 12px;' :
                'height: 38px; min-width: 96px; padding: 2px 16px; font-size: 15px;'
            }
        }
    </style>`
    function paletteStyle() {
        switch (palette) {
        case 'secondary':
            return `button {
                font-weight: 500;
                color: var(--foreground);
                background: var(--secondary-header);
            }
            button:hover {
                background: var(--primary-header);
            }
            button:disabled {
                background: var(--secondary-header);
            }
            button:active {
                background: var(--secondary-background);
            }`
        case 'plain': case 'plain-secondary':
            return `button {
                color: ${palette == "plain"
                ? "var(--foreground)"
                : "var(--secondary-foreground)"};
                    background: transparent;
            }
            button:hover {
                text-decoration: underline;
            }

            button:disabled {
                opacity: 0.5;
            }

            button:active {
                color: var(--tertiary-foreground);
            }`
        case "accent": case "success": case "warning": case "error":
            return `button {
                font-weight: 600;
                color: #fff;
                background: var(--${palette});
            }
            button:hover {
                filter: brightness(1.2);
            }

            button:active {
                filter: brightness(0.8);
            }

            button:disabled {
                filter: brightness(0.7);
            }`
        default:
            return `button {
                font-weight: 500;
                color: var(--foreground);
                background: var(--primary-background);
            }

            button:hover {
                background: var(--secondary-header);
            }

            button:disabled {
                background: var(--primary-background);
            }
            button:active {
                background: var(--secondary-background);
            }`
        }
    }
    const paletteCSS = `<style>${paletteStyle()}</style>`
</script>


{@html compactCSS}
{@html paletteCSS}
<style>
    button {
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
    }

    button:disabled {
        cursor: not-allowed;
    }
</style>

<button {...props} on:click={()=>dispatch('click')}>
    <slot />
</button>