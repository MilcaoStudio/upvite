<script lang="ts">
    import { browser } from "$app/environment";
    import { state } from "$lib/State";
    import Binder from "$lib/components/context/Binder.svelte";
    import Locale from "$lib/components/context/Locale.svelte";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import ModalRenderer from "$lib/components/modals/ModalRenderer.svelte";
    import "../styles/app.css";
    import '../styles/overlap.css';
    import "../styles/atoms.css";
    import "../styles/animations.css"
    import "fluent-svelte/theme.css";
    import 'tippy.js/dist/tippy.css';
    import "../styles/buttons.css";
    import { afterUpdate } from "svelte";
    import Theme from "$lib/components/context/Theme.svelte";
    

    let ready = false;
    if (browser) {
        state.hydrate().then(() => (ready = true));
    }

    afterUpdate(()=>{state.plugins.onUpdate()});
</script>

{#if ready}
    
    <Locale>
        <slot />
        <Binder />
        <ModalRenderer />
    </Locale>
    <Theme />
{:else}
    <Preloader type="spinner" />
{/if}

