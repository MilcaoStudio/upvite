<script>
    /** @type {{gap?: string, centred?: boolean, grow?: boolean, children?: import('svelte').Snippet, [key: string]: any}} */
    let {
        gap = "",
        centred = false,
        grow = false,
        children,
        ...rest
    } = $props();
</script>

<div
    class="row"
    style:gap
    style:align-items={centred ? "center" : ""}
    style:justify-content={centred ? "center": ""}
    style:flex-grow={grow ? "1" : ""}
    {...rest}
>
    {@render children?.()}
</div>

<style>
    .row {
        display: flex;
        flex-direction: row;
    }
</style>
