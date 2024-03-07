

  <script lang="ts">
    import { css } from "@emotion/css";
    import { onMount } from "svelte";
    import type { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler } from "svelte/elements";

    export let code = false,
        padding = "var(--textarea-padding)",
        lineHeight = "var(--textarea-line-height)",
        hideBorder = false,
        onChange: ChangeEventHandler<HTMLTextAreaElement> | null = null,
        onKeyUp: KeyboardEventHandler<HTMLTextAreaElement> | null = null,
        onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> | null = null,
        onFocus: FocusEventHandler<HTMLTextAreaElement> | null = null,
        onBlur: (()=>void) | null = null;

    let ref: HTMLTextAreaElement | undefined;

    
    const TextArea = css`
      width: 100%;
      max-height: 228px;
      resize: none;
      display: block;
      font-size: 14px;
      color: var(--foreground);
      background: var(--secondary-background);
      padding: ${padding};
      line-height: ${lineHeight};
      ${hideBorder
          ? `border: none;`
          : `border-radius: var(--border-radius-inner);
          transition: border-color 0.2s ease-in-out;
          border: var(--input-border-width) solid var(--secondary-foreground);`}
      &:focus {
          outline: none;
          ${!hideBorder
              ? `border: var(--input-border-width) solid var(--accent);`
              : ``}
      }
      ${code
          ? `font-family: var(--monospace-font), monospace;`
          : `font-family: inherit;`}
      font-variant-ligatures: var(--ligatures);
    `;

    // Ajusta la altura del textarea al cargar el componente
    onMount(() => {
      if (ref) {
        ref.style.height = "auto";
        ref.style.height = ref.scrollHeight + "px";
      }
    });
    
    // Ajusta la altura del textarea cada vez que su contenido cambia
    function adjustTextareaHeight() {
      if (ref) {
        ref.style.height = "auto";
        ref.style.height = ref.scrollHeight + "px";
      }
    }
</script>

<textarea class={TextArea} bind:this={ref} on:change={onChange} on:keyup={onKeyUp} on:keydown={onKeyDown} on:focus={onFocus} on:blur={onBlur} {...$$restProps} />
