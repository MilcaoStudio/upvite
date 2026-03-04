<script lang="ts">
    import { goto } from "$app/navigation";
    import { state } from "$lib/State";
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import { useClient } from "$lib/controllers/ClientController";
    import type { LayoutData } from "./$types";
    const client = useClient();

    interface Props {
        data: LayoutData;
    }

    let { data }: Props = $props();
    const { server: server_id } = data;

    if (server_id) {
        const server = client.servers.get(server_id);
        if (server && server.channelIds.size) {
            let target_id = server.channels[0].id;
            const last_id = state.layout.getLastOpened(server_id);
            if (last_id) {
                if (client.channels.has(last_id)) {
                    target_id = last_id;
                }
            }
            goto(`/server/${server_id}/channel/${target_id}`);
        }
    } else {
        goto("/");
    }
</script>

<UprisingApp>
    <Preloader type="ring" />
</UprisingApp>
