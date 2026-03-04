<script>
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<div class="container">
    {@render children?.()}
</div>

<style>
    .container {
        padding: 4rem 2rem 2rem;
        width: 100%;
    }
</style>