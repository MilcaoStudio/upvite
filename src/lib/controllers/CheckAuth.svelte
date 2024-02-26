<script lang="ts">
    import { clientController } from "./ClientController";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { autorun } from "mobx";
    
    export let auth: boolean = false, blockRender: boolean = false;

    console.log($page.url.pathname, 'requiresAuth?', auth);
    let loggedIn = false;
    let ready = false;
    $: autorun(()=>{
        loggedIn = clientController.isLoggedIn;
        ready = clientController.isReady || false;
        console.log('logged in?', loggedIn);
        if (auth && !loggedIn){
            if (!blockRender) goto('/login');
        } else if (!auth && loggedIn) {
            if (!blockRender) goto('/');
        }
    });
    
</script>

{#if auth && loggedIn && !ready}
    <Preloader type='spinner' />
{:else}
    <slot />
{/if}
