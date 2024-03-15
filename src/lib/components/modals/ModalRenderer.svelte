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
  let components: Map<string, SvelteComponent | null> = new Map;
  let stacked = new Set;
  autorun(() => {
    stacked.clear();
    for (const modal of modalController.stack) {
      const { key, type, ...props } = modal;
      // Component is rendered?
      const comp = components.get(key || "");

      stacked.add(key);
      if (comp) {
        // Update the component
      } else {
        // Component is registered?
        if (!(type in modalController.components)) {
          continue;
        }
        // Render component
        const Constructor = modalController.components[type];
        components.set(
          key ?? "",
          new Constructor({
            target: document.body,
            props: {
              props: {
                ...props,
                type,
                onClose: () => modalController.remove(key ?? ""),
              },
            },
          }),
        );
      }
    }
    // Destroy component
    for (const [key, value] of components.entries()) {
      if (!stacked.has(key)) {
        console.info("Destroy", key);
        setTimeout(()=>value?.$destroy(), 200);
        components.delete(key);
      }
    }
    
  });

  // Prevents memory leaks
  onDestroy(() => {
    for (const comp of components.values()) {
      comp?.$destroy();
    }
  });
</script>

<svelte:document on:keydown={keyDown} />
