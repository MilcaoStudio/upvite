

  <script lang="ts">
    import { css } from "@emotion/css";
    import type { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler } from "svelte/elements";

    export let code = false,
        tabSize = 4,
        padding = "var(--textarea-padding)",
        lineHeight = "var(--textarea-line-height)",
        hideBorder = false,
        onChange: ChangeEventHandler<HTMLTextAreaElement> | null = null,
        onKeyUp: KeyboardEventHandler<HTMLTextAreaElement> | null = null,
        onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> | null = null,
        onFocus: FocusEventHandler<HTMLTextAreaElement> | null = null,
        onBlur: (()=>void) | null = null;

    export let ref: HTMLTextAreaElement | undefined;

    const TextArea = css`
      width: 100%;
      max-height: 228px;
      resize: none;
      display: block;
      font-size: 14px;
      color: var(--foreground);
      background: var(--secondary-background);
      tab-size: ${tabSize};
      padding: ${padding};
      line-height: ${lineHeight};
      grid-area: 1 / 1 / 2 / 2;
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
  
</script>

<textarea class={TextArea} bind:this={ref} on:change={onChange} on:keyup={onKeyUp} on:keydown={onKeyDown} on:focus={onFocus} on:blur={onBlur} {...$$restProps} />
