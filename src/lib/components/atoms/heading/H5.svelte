<script>
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<style>
    /* SETTINGS DESCRIPTION */
    h5 {
        margin-top: 0;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--foreground);
    }
</style>
<h5>{@render children?.()}</h5>