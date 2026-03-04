<script>
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<style>
    h1 {
        margin: 0;
        line-height: 1rem;
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--foreground);
    }
</style>

<h1>{@render children?.()}</h1>