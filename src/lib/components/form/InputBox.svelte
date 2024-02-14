<script lang="ts">
    import type { ChangeEventHandler, HTMLInputAttributes } from "svelte/elements";

    export let props: HTMLInputAttributes & {
        palette: 'primary' | 'secondary',
    };
    const css = `
    <style>
        input.InputBox {
            width: 100%;
            padding: 11px 16px;
            font-size: 0.9375rem;
            font-family: inherit;
            font-weight: 500;
            border: none;
            border-radius: var(--border-radius);
            box-sizing: border-box;
            outline: none;
            transition: 0.1s ease-in-out all;
            ${props.palette == 'primary' ? `
                color: var(--foreground);
                background: var(--primary-background);
            ` : `
                color: var(--secondary-foreground);
                background: var(--secondary-background);
            `}
        }
        input.InputBox:disabled {
            filter: brightness(0.9);
        }

        input.InputBox:focus-visible {
            box-shadow: 0 0 0 1.5pt var(--accent);
        }

        input.InputBox:hover {
            background: ${props.palette == 'primary' ? 'var(--secondary-background)' : 'var(--hover)'};
        }
    </style>`;
</script>

<input class="InputBox" {...props} on:change={props['on:change']} />
{@html css}