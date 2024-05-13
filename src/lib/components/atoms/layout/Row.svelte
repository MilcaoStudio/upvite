<script>
    export let gap = "8px",
        centred = false,
        grow = false;
</script>

<div
    class="row"
    style:gap
    style:align-items={centred ? "center" : ""}
    style:flex-grow={grow ? "1" : ""}
>
    <slot />
</div>

<style>
    .row {
        display: flex;
        flex-direction: row;
    }
</style>
