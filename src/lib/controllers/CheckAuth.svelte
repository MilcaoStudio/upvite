<script lang="ts">
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import { goto } from "$app/navigation";
    import { getContext, type Snippet } from "svelte";
    import { useClientController } from "$lib/components/client/ClientContext.svelte";

    interface Props {
        /**
         * Whether this page requires authentication to render.
         */
        auth?: boolean;
        disableRedirect?: boolean;
        children?: Snippet;
    }

    let { auth = false, disableRedirect = false, children }: Props = $props();
    let clientController = useClientController();
    let loggedIn = clientController.loggedIn;
    let ready = clientController.ready;
    $inspect(loggedIn, ready);
    let invite_code: string = getContext("invite");
    $effect(() => {
        try {
            if (auth && !loggedIn) {
                console.debug("[CheckAuth] Redirect to login");
                if (!disableRedirect) goto("/login");
            } else if (!auth && loggedIn) {
                console.debug("[CheckAuth] Redirect to home");
                if (!disableRedirect)
                    goto(invite_code ? `/invite/${invite_code}` : `/`);
            }
        } catch (error) {
            console.error(error);
        }
    });
</script>

{#if auth && loggedIn && !ready}
    <Preloader type="spinner" />
{:else}
    {@render children?.()}
{/if}
