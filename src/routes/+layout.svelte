<script lang="ts">
    import { browser } from '$app/environment';
    import { page } from '$app/stores';
    import { state } from '$lib/State';
    import Locale from '$lib/components/context/Locale.svelte';
    import CheckAuth from '$lib/controllers/CheckAuth.svelte';
    import '../styles/app.css'

    if (browser) {
	    state.hydrate().then(()=>console.log('State is READY!'));
    }
</script>
<Locale>
{#if $page.url.pathname.startsWith('/login')}
    <CheckAuth>
        <slot />
    </CheckAuth>
{:else}
    <CheckAuth auth>
        <slot />
    </CheckAuth>
{/if}
</Locale>