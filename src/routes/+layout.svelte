<script lang="ts">
    import { page } from '$app/stores';
    import CheckAuth from '$lib/controllers/CheckAuth.svelte';
    import '../styles/app.css'

</script>

{#if $page.url.pathname.startsWith('/login')}
    <CheckAuth>
        <slot />
    </CheckAuth>
{:else}
    <CheckAuth auth>
        <slot />
    </CheckAuth>
{/if}