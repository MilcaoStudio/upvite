<script lang="ts">
    import { state } from "$lib/State";
    import { modalController } from "$lib/components/modals/ModalController";
    import { Client } from "revolt.js";

    import ServerList from "../servers/ServerList.svelte";
    export let client: Client, server_id: string;
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
