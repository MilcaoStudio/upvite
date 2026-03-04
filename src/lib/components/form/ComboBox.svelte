<script lang="ts">
    import type { ChangeEventHandler } from "svelte/elements";

    interface Props {
        onChange?: ChangeEventHandler<HTMLSelectElement> | null;
        children?: import('svelte').Snippet;
        [key: string]: any
    }

    let { onChange = null, children, ...rest }: Props = $props();
</script>

<select class="ComboBox" onchange={onChange} {...rest}>
    {@render children?.()}
</select>

<style>
    .ComboBox {
        width: 100%;
        padding: 11px 16px;

        font-size: 0.9375rem;
        font-family: inherit;
        font-weight: 500;

        color: var(--foreground);
        background: var(--secondary-background);

        border: none;
        border-radius: var(--border-radius);
        box-sizing: border-box;
        outline: none;
        cursor: pointer;

        transition: 0.1s ease-in-out all;
    }

    .ComboBox:focus-visible {
        box-shadow: 0 0 0 1.5pt var(--accent);
    }
</style>
