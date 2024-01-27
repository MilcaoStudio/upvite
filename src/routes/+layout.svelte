<script lang="ts">
    import { browser } from '$app/environment';
    import { page } from '$app/stores';
    import { PUBLIC_ACCOUNT } from '$env/static/public';
    import { state } from '$lib/State';
    import CheckAuth from '$lib/controllers/CheckAuth.svelte';
    import { clientController } from '$lib/controllers/ClientController';
    import '../styles/app.css'

    if (PUBLIC_ACCOUNT) {
        const credentials = PUBLIC_ACCOUNT.split(':');
        clientController.login({email: credentials[0], password: credentials[1]});
    }
    if (browser) {
	    state.hydrate().then(()=>console.log('State is READY!'));
    }
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