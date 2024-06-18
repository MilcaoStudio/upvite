<script lang="ts">
    import { clientController } from "./ClientController";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import { goto } from "$app/navigation";
    import { autorun } from "mobx";
    import { getContext } from "svelte";

    export let auth: boolean = false,
        blockRender: boolean = false;

    $: loggedIn = false;
    let ready = false;
    let invite_code: string = getContext("invite");
    $: autorun(async () => {
        loggedIn = clientController.isLoggedIn;
        ready = clientController.isReady || false;
        try {
            if (auth && !loggedIn) {
                console.debug("[CheckAuth] Redirect to login");
                if (!blockRender) await goto("/login");
            } else if (!auth && loggedIn) {
                console.debug("[CheckAuth] Redirect to home");
                if (!blockRender)
                    await goto(invite_code ? `/invite/${invite_code}` : `/`);
            }
        } catch (error) {
            console.error(error);
        }
    });
</script>

{#if auth && loggedIn && !ready}
    <Preloader type="spinner" />
{:else}
    <slot />
{/if}
