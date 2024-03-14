<script lang="ts">
  import "../../../styles/modal.css";
  import { modalController } from "./ModalController";
  import { onDestroy, type SvelteComponent } from "svelte";
  import { autorun } from "mobx";
  function keyDown(event: KeyboardEvent) {
    if (event.key == "Escape") {
      modalController.pop("close");
    } else if (event.key == "Enter") {
      if (event.target instanceof HTMLSelectElement) {
        return;
      }
      modalController.pop("confirm");
    }
  }
  let stack: SvelteComponent[] = [];
  autorun(() => {
    for (const modal of modalController.stack) {
      const component = stack.find(
        (comp) => comp.$$.ctx[0] && comp.$$.ctx[0].key == modal.key,
      );
      if (component) {
        component.$set({
          props: {
            ...modal,
            onClose: () => modalController.remove(modal.key || ""),
          },
        });
      } else {
        stack.push(
          new modalController.components[modal.type]({
            target: document.body,
            props: {
              props: {
                ...modal,
                onClose: () => modalController.remove(modal.key || ""),
              },
            },
          }),
        );
      }
    }
    return () => {
      stack.forEach((comp) => comp.$destroy);
      stack = [];
    };
  });
  onDestroy(() => {
    stack.forEach((comp) => comp.$destroy());
  });
</script>

<svelte:document on:keydown={keyDown} />
