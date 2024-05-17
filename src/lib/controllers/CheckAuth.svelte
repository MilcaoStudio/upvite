<script lang="ts">
    import { clientController } from "./ClientController";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import { goto } from "$app/navigation";
    import { autorun } from "mobx";
    import { getContext } from "svelte";
    
    export let auth: boolean = false, blockRender: boolean = false;

    let loggedIn = false;
    let ready = false;
    let invite_code: string = getContext("invite");
    $: autorun(()=>{
        loggedIn = clientController.isLoggedIn;
        ready = clientController.isReady || false;
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
