<script>
    import H3 from "$lib/components/atoms/heading/H3.svelte";
    import InDevelopment from "$lib/components/atoms/inDevelopment.svelte";
    import { Checkbox } from "fluent-svelte";
    import Plugins from "./plugins.svelte";
    import { state } from "$lib/State";

    let checked = state.network.get("media")?.shrinkMedia;
    $: state.network.set("media", {shrinkMedia: checked});

</script>

<InDevelopment></InDevelopment>
<H3>Ahorro de datos</H3>
<Checkbox bind:checked>Reducir tamaño de multimedia </Checkbox>

<Plugins />