<script lang="ts">
    import { goto } from "$app/navigation";
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import TextChannel from "$lib/components/channels/TextChannel.svelte"
    import type { LayoutData } from "./$types";
    import { isTouchscreenDevice } from "$lib";
    import { SIDEBAR_CHANNELS, Viewport } from "$lib/components/state/stores/Layout";
    import { autorun } from "mobx";
    import ServerMemberSidebar from "$lib/components/navigation/right/ServerMemberSidebar.svelte";
    import { useClient } from "$lib/components/client/ClientContext.svelte";
    import { useState } from "$lib/components/state/StateContext.svelte";
    const client = useClient();

    interface Props {
        data: LayoutData;
    }

    let { data }: Props = $props();
    
    
    let id = $derived(data.channel);
    let server_id = $derived(data.server);
    let message = $derived(data.message);
    let server = $derived(client.servers.get(server_id));
    const layout = useState().layout;

    $effect(()=>{
        if (!client.channels.has(id)) {
            if (server_id) {
            if (!server) {
                goto("/");
            }

            if (server && server.channelIds.size > 0) {
                let target_id = server.channels[0].id;
                const last_id = layout.getLastOpened(server_id);
                if (last_id) {
                    if (client.channels.has(last_id)) {
                        target_id = last_id;
                    }
                }

                goto(`/server/${server_id}/channel/${target_id}`)
            }
            }
        }
    })

    let channel = $derived(client.channels.get(id));
</script>

<UprisingApp>
    {#if channel}
        <TextChannel {channel} {message} />
    {/if}
</UprisingApp>

