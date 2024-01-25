<script lang="ts">
    import { clientController } from "./ClientController";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import { redirect } from "@sveltejs/kit";
    import { page } from "$app/stores";

    export let auth: boolean = false, blockRender: boolean = false;
    console.log($page.url.pathname, 'requiresAuth?', auth);
    const loggedIn = clientController.isLoggedIn();

    if (auth && !loggedIn){
        if (!blockRender) redirect(300, '/login');
    } else if (!auth && loggedIn) {
        if (!blockRender) redirect(300, '/');
    }
</script>

{#if auth && clientController.isLoggedIn() && !clientController.isReady()}
    <Preloader type='spinner' />
{:else}
    <slot />
{/if}