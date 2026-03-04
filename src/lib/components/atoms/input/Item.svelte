<script lang="ts">
    interface Props {
        height?: "compact" | "normal";
        selected?: boolean;
        onclick?: (()=>void) | undefined;
        backgroundSelected?: string;
        children?: import('svelte').Snippet;
        [key: string]: any
    }

    let {
        height = "normal",
        selected = false,
        onclick = undefined,
        backgroundSelected = "var(--hover)",
        children,
        ...rest
    }: Props = $props();
</script>

<button
    class="item"
    {onclick}
    {...rest}
    style:height={height == "compact" ? "32px" : "42px"}
    style:background={selected ? backgroundSelected : "none"}
>{@render children?.()}</button>

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
