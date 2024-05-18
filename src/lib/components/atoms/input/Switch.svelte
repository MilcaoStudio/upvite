<script lang="ts">
    import type { SwitchState } from "$lib/types/Form";

    export let selected = false,
        state: SwitchState,
        onClick: ()=>void;
    $: color = selected
        ? "white"
        : state == "Allow"
          ? "var(--success)"
          : state == "Deny"
            ? "var(--error)"
            : "var(--tertiary-background)";
    $: background = selected
        ? state == "Allow"
            ? "var(--success)"
            : state == "Deny"
              ? "var(--error)"
              : "var(--primary-background)"
        : "";
</script>

<div
    class="Switch"
    style:color
    style:background
    role="radio"
    aria-checked={selected}
    on:click={onClick}
    on:keypress={onClick}
    tabindex="0"
>
    <slot />
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
