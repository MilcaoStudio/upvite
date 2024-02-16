<script lang="ts">
    import { clientController } from "./ClientController";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { connect } from "svelte-mobx";
    
    export let auth: boolean = false, blockRender: boolean = false;

    const { autorun } = connect();
    console.log($page.url.pathname, 'requiresAuth?', auth);
    let loggedIn = false;
    $: autorun(()=>{
        loggedIn = clientController.isLoggedIn;
        console.log('logged in?', loggedIn);
        if (auth && !loggedIn){
            if (!blockRender) goto('/login');
        } else if (!auth && loggedIn) {
            if (!blockRender) goto('/');
        }
    });
    
</script>

{#key loggedIn}
    {#if auth && loggedIn && !clientController.isReady}
        <Preloader type='spinner' />
    {:else}
        <slot />
    {/if}
{/key}
