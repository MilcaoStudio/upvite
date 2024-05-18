<script lang="ts">
    export let height: "compact" | "normal" = "normal",
        selected = false, onclick: (()=>void) | undefined = undefined,
        backgroundSelected = "var(--hover)";
</script>

<button
    class="item"
    on:click={onclick}
    {...$$restProps}
    style:height={height == "compact" ? "32px" : "42px"}
    style:background={selected ? backgroundSelected : "none"}
><slot /></button>

<style>
    .item {
        padding: 0 16px;
        cursor: pointer;
        user-select: none;

        border: 0;
        border-radius: var(--border-radius-small);

        color: var(--foreground);
        transition: 0.1s ease-in-out background-color;
    }

    .item:hover {
        background: var(--hover);
    }
</style>
