<script lang="ts">
    import { goto } from "$app/navigation";
    import { state } from "$lib/State";
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import TextChannel from "$lib/components/channels/TextChannel.svelte"
    import { useClient } from "$lib/controllers/ClientController";
    import type { Channel } from "revolt.js";
    import type { LayoutData } from "./$types";
    const client = useClient();

    export let data: LayoutData;
    const { channel: id, server: server_id } = data;

    let channel: Channel | undefined
    if (!client.channels.exists(id)) {
        if (server_id) {
            const server = client.servers.get(server_id);
            if (server && server.channel_ids.length > 0) {
                let target_id = server.channel_ids[0];
                const last_id = state.layout.getLastOpened(server_id);
                if (last_id) {
                    if (client.channels.has(last_id)) {
                        target_id = last_id;
                    }
                }

                goto(`/server/${server_id}/channel/${target_id}`)
            }
        } else {
            goto("/")
        }

    }
    channel = client.channels.get(id);
</script>

<UprisingApp>
    {#if channel}
        <TextChannel {channel} />
    {/if}
</UprisingApp>