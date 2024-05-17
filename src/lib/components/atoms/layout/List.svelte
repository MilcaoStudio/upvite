<script>
    import Column from "./Column.svelte";
</script>

<div role="list">
    <Column gap="16px">
        <slot />
    </Column>
</div>

<style>
    div {
        max-width: 100%;
        max-height: 360px;
        overflow-y: scroll;
    }
</style>
