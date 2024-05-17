<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { state } from "$lib/State";
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import TextChannel from "$lib/components/channels/TextChannel.svelte";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import { useClient } from "$lib/controllers/ClientController";
    const client = useClient();
    export let data;
    let { channel_id, message_id } = data;

    let channel = client.channels.get(channel_id);
    if (!channel) {
        goto(state.layout.getLastHomePath());
    }
    state.layout.setLastHomePath($page.url.pathname);
</script>

<UprisingApp>
    {#if channel}
        <TextChannel {channel} message={message_id} />
    {:else}
        <Preloader type="ring" />
    {/if}
</UprisingApp>

