<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import TextChannel from "$lib/components/channels/TextChannel.svelte";
    import { useClient } from "$lib/components/client/ClientContext.svelte";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import { useState } from "$lib/components/state/StateContext.svelte";
    import type { LayoutData } from "./$types";
    const client = useClient();
    interface Props {
        data: LayoutData;
    }

    let { data }: Props = $props();
    let { channel_id, message_id } = $derived(data);

    const layout = useState().layout;
    let channel = $derived(client.channels.get(channel_id));
    $effect(()=>{
        if (!channel) {
            goto(layout.getLastHomePath());
        }
    })
    layout.setLastHomePath(page.url.pathname);
</script>

<UprisingApp>
    {#if channel}
        <TextChannel {channel} message={message_id} />
    {:else}
        <Preloader type="ring" />
    {/if}
</UprisingApp>

