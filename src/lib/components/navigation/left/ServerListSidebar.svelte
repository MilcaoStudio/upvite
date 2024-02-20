<script lang="ts">
    import { state } from "$lib/State";
    import { routeInformation } from "$lib/components/context/history";
    import { modalController } from "$lib/components/modals/ModalController";
    import { useClient } from "$lib/controllers/ClientController";

    import ServerList from "../servers/ServerList.svelte";

    const client = useClient();
    const server_id = routeInformation.getServer();
    function createServer() {
        modalController.push({ type: "create_server" });
    }
</script>

<ServerList
    {client}
    active={server_id}
    {createServer}
    permit={state.notifications}
    home={state.layout.getLastHomePath}
    servers={state.ordering.orderedServers}
    reorder={state.ordering.reorderServer}
/>
