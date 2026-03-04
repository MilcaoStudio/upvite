<script>
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<style>
    /* MODAL SUBTITLE */
    h4 {
        margin: 0;
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--secondary-foreground);
    }
</style>
<h4>{@render children?.()}</h4>