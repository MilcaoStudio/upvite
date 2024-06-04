<script>
    export let gap = "",
        centred = false,
        grow = false;
</script>

<div
    class="row"
    style:gap
    style:align-items={centred ? "center" : ""}
    style:flex-grow={grow ? "1" : ""}
    {...$$restProps}
>
    <slot />
</div>

<style>
    .row {
        display: flex;
        flex-direction: row;
    }
</style>
