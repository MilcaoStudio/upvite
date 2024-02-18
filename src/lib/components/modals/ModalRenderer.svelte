<script lang="ts">
    import '../../../styles/modal.css'
    import { connect } from "svelte-mobx";
    import { modalController } from "./ModalController";
    import type { SvelteComponent } from "svelte";
    const { autorun } = connect();
    function keyDown(event: KeyboardEvent) {
    if (event.key == 'Escape') {
      modalController.pop('close');
    } else if (event.key == 'Enter') {
      if (event.target instanceof HTMLSelectElement) { return }
      modalController.pop('confirm');
    }
  }
  let stack: SvelteComponent[] = [];
  $: autorun(()=>{
    stack.forEach(comp=>comp.$destroy());
    stack = modalController.stack.map(modal=>{
      const Component = modalController.components[modal.type];
      return new Component({target: document.body, props: {props: {...modal, onClose: ()=>modalController.remove(modal.key || '')}}});
    }
  )});
</script>

<svelte:document on:keydown={keyDown} />