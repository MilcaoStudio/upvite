<script lang="ts">
    import type { SwitchState } from "$lib/types/Form";

    interface Props {
        selected?: boolean;
        state: SwitchState;
        onClick: ()=>void;
        children?: import('svelte').Snippet;
    }

    let {
        selected = false,
        state,
        onClick,
        children
    }: Props = $props();
    let color = $derived(selected
        ? "white"
        : state == "Allow"
          ? "var(--success)"
          : state == "Deny"
            ? "var(--error)"
            : "var(--tertiary-background)");
    let background = $derived(selected
        ? state == "Allow"
            ? "var(--success)"
            : state == "Deny"
              ? "var(--error)"
              : "var(--primary-background)"
        : "");
</script>

<div
    class="Switch"
    style:color
    style:background
    role="radio"
    aria-checked={selected}
    onclick={onClick}
    onkeypress={onClick}
    tabindex="0"
>
    {@render children?.()}
</div>

<style>
    .Switch {
        padding: 4px;
        width: 32px;
        text-align: center;
        cursor: pointer;
        transition: 0.2s ease all;
    }

    .Switch:hover {
        filter: brightness(0.8);
    }
</style>
