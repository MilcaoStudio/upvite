<script>
    /** @type {{children?: import('svelte').Snippet, [key: string]: any}} */
    let { children, ...rest } = $props();
</script>

<style>
    /* SETTINGS SECTION TITLE, 
       NOT TO BE CONFUSED WITH CATEGORY TITLES, 
       DO NOT USE HEADINGS ON THOSE. */
    h3 {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--secondary-foreground);
    }
</style>

<h3 {...rest}>{@render children?.()}</h3>