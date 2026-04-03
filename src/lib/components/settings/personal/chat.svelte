<script>
    import H3 from "$lib/components/atoms/heading/H3.svelte";
    import InDevelopment from "$lib/components/atoms/inDevelopment.svelte";
    import { useState } from "$lib/components/state/StateContext.svelte";
    import { Checkbox } from "fluent-svelte";
    
    let network = useState().network;
    let shrinkMedia = $state(network.media?.shrinkMedia);
    let autoplay = $state(network.media?.autoplay);
    // make a slider instead?
    let lessMessages = $state(network.channel.messagesLimit < 50);
    $effect(() => {
        network.set("channel", {messagesLimit: lessMessages ? 30 : 100});
    });
    $effect(() => {
        network.set("media", {shrinkMedia, autoplay});
    });

</script>

<InDevelopment></InDevelopment>
<H3>Ahorro de datos</H3>
<Checkbox bind:checked={shrinkMedia}>Reducir tamaño de multimedia </Checkbox>
<Checkbox bind:checked={autoplay}>Reproducir GIFs automáticamente</Checkbox>
<Checkbox bind:checked={lessMessages}>Reducir descarga de mensajes</Checkbox>