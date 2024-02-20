<script lang="ts">
    import { goto } from "$app/navigation";
    import { state } from "$lib/State";
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import { useClient } from "$lib/controllers/ClientController";
    import type { LayoutData } from "./$types";
    const client = useClient();

    export let data: LayoutData;
    const { server: server_id } = data;

    if (server_id) {
        const server = client.servers.get(server_id);
        if (server && server.channel_ids.length) {
            let target_id = server.channel_ids[0];
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

<UprisingApp />
