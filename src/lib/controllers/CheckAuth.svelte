<script lang="ts">
    import { clientController } from "./ClientController";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { autorun } from "mobx";
    import { getContext } from "svelte";
    
    export let auth: boolean = false, blockRender: boolean = false;

    console.log($page.url.pathname, 'requiresAuth?', auth);
    let loggedIn = false;
    let ready = false;
    let invite_code: string = getContext("invite");
    $: console.log(invite_code);
    $: autorun(()=>{
        loggedIn = clientController.isLoggedIn;
        ready = clientController.isReady || false;
        console.log('logged in?', loggedIn);
        if (auth && !loggedIn){
            if (!blockRender) goto('/login');
        } else if (!auth && loggedIn) {
            if (!blockRender) goto(invite_code ? `/invite/${invite_code}` : `/`);
        }
    });
    
</script>

{#if auth && loggedIn && !ready}
    <Preloader type='spinner' />
{:else}
    <slot />
{/if}
