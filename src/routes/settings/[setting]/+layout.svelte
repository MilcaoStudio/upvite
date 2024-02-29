<script>
    import CheckAuth from "$lib/controllers/CheckAuth.svelte";
</script>

<CheckAuth blockRender>
    <slot />
</CheckAuth>