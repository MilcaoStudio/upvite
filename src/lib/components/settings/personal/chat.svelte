<script>
    import { run } from 'svelte/legacy';

    import { state } from "$lib/State";
    import H3 from "$lib/components/atoms/heading/H3.svelte";
    import InDevelopment from "$lib/components/atoms/inDevelopment.svelte";
    import { Checkbox } from "fluent-svelte";
    
    let media = state.network.media;
    let shrinkMedia = $state(media?.shrinkMedia);
    let autoplay = $state(media?.autoplay);
    // make a slider instead?
    let lessMessages = $state(state.network.channel.messagesLimit < 50);
    run(() => {
        state.network.set("channel", {messagesLimit: lessMessages ? 30 : 100});
    });
    run(() => {
        state.network.set("media", {shrinkMedia, autoplay});
    });

</script>

<InDevelopment></InDevelopment>
<H3>Ahorro de datos</H3>
<Checkbox bind:checked={shrinkMedia}>Reducir tamaño de multimedia </Checkbox>
<Checkbox bind:checked={autoplay}>Reproducir GIFs automáticamente</Checkbox>
<Checkbox bind:checked={lessMessages}>Reducir descarga de mensajes</Checkbox>