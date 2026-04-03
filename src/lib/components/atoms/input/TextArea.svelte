

  <script lang="ts">
    import { css } from "@emotion/css";
    import type { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler } from "svelte/elements";


  interface Props {
    code?: boolean;
    tabSize?: number;
    padding?: string;
    lineHeight?: string;
    hideBorder?: boolean;
    onChange?: ChangeEventHandler<HTMLTextAreaElement> | null;
    onKeyUp?: KeyboardEventHandler<HTMLTextAreaElement> | null;
    onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | null;
    onFocus?: FocusEventHandler<HTMLTextAreaElement> | null;
    onBlur?: (()=>void) | null;
    ref: HTMLTextAreaElement | undefined;
    [key: string]: any
  }

  let {
    code = false,
    tabSize = 4,
    padding = "var(--textarea-padding)",
    lineHeight = "var(--textarea-line-height)",
    hideBorder = false,
    onChange = null,
    onKeyUp = null,
    onKeyDown = null,
    onFocus = null,
    onBlur = null,
    ref = $bindable(),
    ...rest
  }: Props = $props();

    const TextArea = $derived(css`
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
    `);
  
</script>

<textarea class={TextArea} bind:this={ref} onchange={onChange} onkeyup={onKeyUp} onkeydown={onKeyDown} onfocus={onFocus} onblur={onBlur} {...rest}></textarea>
