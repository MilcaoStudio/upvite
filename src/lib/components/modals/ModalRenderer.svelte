<script lang="ts">
    import { connect } from "svelte-mobx";
    import { modalController } from "./ModalController";
    import type { Modal } from "$lib/types/Modal";
    const { autorun } = connect();
    function keyDown(event: KeyboardEvent) {
    if (event.key == 'Escape') {
      modalController.pop('close');
    } else if (event.key == 'Enter') {
      if (event.target instanceof HTMLSelectElement) { return }
      modalController.pop('confirm');
    }
  }
  let stack: Modal[] = [];
  $: autorun(()=>{
    stack = modalController.stack;
  })
</script>

<svelte:document on:keydown={keyDown} />

{#each stack as modal}
	<svelte:component this={modalController.components[modal.type]} props={{...modal, onClose: ()=>modalController.remove(modal.key || '')}} />	
{/each}