<script>
    import { state } from "$lib/State";
    import { clientController } from "$lib/controllers/ClientController";
    import { autorun } from "mobx";
    import { onDestroy } from "svelte";
    let dispose = ()=>{};
    $: autorun(()=>{
        dispose();
        dispose = state.registerListeners(clientController.readyClient);
        console.log('[Binder.svelte] listeners registered!');
    });
    onDestroy(dispose);
</script>
