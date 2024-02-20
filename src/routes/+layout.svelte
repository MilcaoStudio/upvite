<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { state } from "$lib/State";
    import Binder from "$lib/components/context/Binder.svelte";
    import Locale from "$lib/components/context/Locale.svelte";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import ModalRenderer from "$lib/components/modals/ModalRenderer.svelte";
    import CheckAuth from "$lib/controllers/CheckAuth.svelte";
    import "../styles/app.css";
    import '../styles/overlap.css'
    import "fluent-svelte/theme.css";

    let ready = false;
    if (browser) {
        state.hydrate().then(() => (ready = true));
    }
</script>

{#if ready}
    <Locale>
        {#if $page.url.pathname.startsWith("/login")}
            <CheckAuth>
                <slot />
            </CheckAuth>
        {:else}
            <CheckAuth auth>
                <slot />
            </CheckAuth>
        {/if}
        <Binder />
        <ModalRenderer />
    </Locale>
{:else}
    <Preloader type="spinner" />
{/if}
