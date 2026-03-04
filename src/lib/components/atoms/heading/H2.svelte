<script>
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<style>
    h2 {
        margin: 0;
        font-size: 0.9375rem;
        font-weight: 700;
        color: var(--foreground);
    }
</style>
<h2>{@render children?.()}</h2>