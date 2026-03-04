<script>
    import CheckAuth from "$lib/controllers/CheckAuth.svelte";
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<CheckAuth auth>
    {@render children?.()}
</CheckAuth>