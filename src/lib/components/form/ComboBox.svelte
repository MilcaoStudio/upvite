<script lang="ts">
    import type { ChangeEventHandler } from "svelte/elements";

    export let onChange: ChangeEventHandler<HTMLSelectElement> | null = null;
</script>

<select class="ComboBox" on:change={onChange} {...$$restProps}>
    <slot />
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
