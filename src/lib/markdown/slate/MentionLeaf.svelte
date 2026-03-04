<script>
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<span class="mention" data-slate-leaf="true">
    {@render children?.()}
</span>

<style>
    .mention {
        font-weight: 600;
        background-color: var(--accent-dark);
        color: var(--foreground);
        padding: 0 4px;
    }
</style>