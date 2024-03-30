<script>
    import H3 from "$lib/components/atoms/heading/H3.svelte";
    import InDevelopment from "$lib/components/atoms/inDevelopment.svelte";
    import { Checkbox } from "fluent-svelte";
    import Plugins from "./plugins.svelte";
    import { state } from "$lib/State";

    let media = state.network.get("media");
    let shrinkMedia = media?.shrinkMedia;
    let autoplay = media?.autoplay;
    $: state.network.set("media", {shrinkMedia, autoplay});

</script>

<InDevelopment></InDevelopment>
<H3>Ahorro de datos</H3>
<Checkbox bind:checked={shrinkMedia}>Reducir tamaño de multimedia </Checkbox>
<Checkbox bind:checked={autoplay}>Reproducir GIFs automáticamente</Checkbox>

<Plugins />