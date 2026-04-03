<!-- @migration-task Error while migrating Svelte code: Can't migrate code with afterUpdate. Please migrate by hand. -->
<script lang="ts">
    import Locale from "$lib/components/context/Locale.svelte";
    import ModalRenderer from "$lib/components/modals/ModalRenderer.svelte";
    import "../styles/app.css";
    import '../styles/overlap.css';
    import "../styles/atoms.css";
    import "../styles/animations.css"
    import "fluent-svelte/theme.css";
    import 'tippy.js/dist/tippy.css';
    import "../styles/buttons.css";
    import Theme from "$lib/components/context/Theme.svelte";
    import StateContext from "$lib/components/state/StateContext.svelte";
    import ClientContext from "$lib/components/client/ClientContext.svelte";
</script>

<StateContext>
    <ClientContext>
        <Locale>
            <slot />
            <ModalRenderer />
        </Locale>
    </ClientContext>
    <Theme />
</StateContext>

