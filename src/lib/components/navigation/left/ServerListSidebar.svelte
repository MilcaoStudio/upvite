<script lang="ts">
    import { state } from "$lib/State";
    import { modalController } from "$lib/components/modals/ModalController";
    import { orderingStore } from "$lib/stores/Ordering";

    import ServerList from "../servers/ServerList.svelte";
    interface Props {
        server_id?: string | undefined;
    }

    let { server_id = undefined }: Props = $props();
    function createServer() {
        modalController.push({ type: "create_server" });
    }
    let servers = orderingStore.orderedServers;
</script>

<ServerList
    active={server_id}
    {createServer}
    home={state.layout.getLastHomePath}
    servers={$servers}
    reorder={(servers)=>orderingStore.hydrate({servers: servers.map(s=>s.id)})}
/>
