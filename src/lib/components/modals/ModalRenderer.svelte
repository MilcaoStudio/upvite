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
      if (!(modal.type in modalController.components)) {
        console.warn(modal.type, "constructor not found. Skipped.");
        continue;
      }
      // Warning: this hack may fail in futures svelte versions.
      const component = stack.find((comp)=>comp.$$.ctx.filter((c: any) => c.key == modal.key).length);
      if (component) {
        // Modify props like signal without destroying the component.
        component.$set({
          props: {
            ...modal,
            onClose: () => modalController.remove(modal.key || ""),
          },
        });
      } else {
        // Creates new modal
        console.info("Rendering modal", modal.key);
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
    
    console.info(stack.length,"components stacked");
    return () => {
      stack.forEach((comp) => comp.$destroy);
    };
  });
  onDestroy(() => {
    stack.forEach((comp) => comp.$destroy());
  });
</script>

<svelte:document on:keydown={keyDown} />
