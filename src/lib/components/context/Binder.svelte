<script>
    import { state } from "$lib/State";
    import { clientController } from "$lib/controllers/ClientController";
    import { autorun } from "mobx";
    import { onDestroy } from "svelte";
    let dispose = ()=>{};
    $: autorun(()=>{
        dispose = state.registerListeners(clientController.readyClient);
        console.log('[Binder.svelte] listeners registered!');
    });
    onDestroy(dispose)
</script>
