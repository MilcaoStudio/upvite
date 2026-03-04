<script lang="ts">
    import { run } from 'svelte/legacy';

    import { clientController } from "./ClientController";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import { goto } from "$app/navigation";
    import { autorun } from "mobx";
    import { getContext } from "svelte";

    interface Props {
        auth?: boolean;
        blockRender?: boolean;
        children?: import('svelte').Snippet;
    }

    let { auth = false, blockRender = false, children }: Props = $props();

    let loggedIn = clientController.loggedIn;
    let ready = clientController.ready;
    let invite_code: string = getContext("invite");
    run(() => {
        autorun(async () => {
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
    });
</script>

{#if auth && $loggedIn && !$ready}
    <Preloader type="spinner" />
{:else}
    {@render children?.()}
{/if}
