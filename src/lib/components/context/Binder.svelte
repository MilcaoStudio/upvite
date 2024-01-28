<script>
    import { state } from "$lib/State";
    import { clientController } from "$lib/controllers/ClientController";

    $: {
        state.registerListeners($clientController.getReadyClient());
    }
</script>
