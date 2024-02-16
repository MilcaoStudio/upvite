<script>
    import { state } from "$lib/State";
    import { clientController } from "$lib/controllers/ClientController";
    import { connect } from "svelte-mobx";
    const { autorun } = connect();
    $: autorun(()=>{
        state.registerListeners(clientController.readyClient);
        console.log('[Binder.svelte] listeners registered!');
    });
</script>
