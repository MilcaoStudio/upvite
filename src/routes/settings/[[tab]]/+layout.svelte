<script>
    import CheckAuth from "$lib/controllers/CheckAuth.svelte";
</script>

<CheckAuth auth>
    <div class="center">
        <slot />
    </div>
    
</CheckAuth>

<style>


</style>
