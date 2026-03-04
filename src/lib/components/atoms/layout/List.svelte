<script>
    import Column from "./Column.svelte";
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<div role="list">
    <Column gap="16px">
        {@render children?.()}
    </Column>
</div>

<style>
    div {
        max-width: 100%;
        max-height: 360px;
        overflow-y: scroll;
    }
</style>
