<script lang="ts">
    import { clientController } from "./ClientController";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import { goto } from "$app/navigation";
    import { autorun } from "mobx";
    import { getContext } from "svelte";

    export let auth: boolean = false,
        blockRender: boolean = false;

    let loggedIn = clientController.loggedIn;
    let ready = clientController.ready;
    let invite_code: string = getContext("invite");
    $: autorun(async () => {
        try {
            if (auth && !$loggedIn) {
                console.debug("[CheckAuth] Redirect to login");
                if (!blockRender) await goto("/login");
            } else if (!auth && $loggedIn) {
                console.debug("[CheckAuth] Redirect to home");
                if (!blockRender)
                    await goto(invite_code ? `/invite/${invite_code}` : `/`);
            }
        } catch (error) {
            console.error(error);
        }
    });
</script>

{#if auth && $loggedIn && !$ready}
    <Preloader type="spinner" />
{:else}
    <slot />
{/if}
