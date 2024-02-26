<script lang="ts">
    import { css } from "@emotion/css";
    import type { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler } from "svelte/elements";

    export let code = false,
        padding = "var(--textarea-padding)",
        lineHeight = "var(--textarea-line-height)",
        hideBorder = false,
        ref: HTMLTextAreaElement | undefined = undefined,
        onChange: ChangeEventHandler<HTMLTextAreaElement> | null = null,
        onKeyUp: KeyboardEventHandler<HTMLTextAreaElement> | null = null,
        onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> | null = null,
        onFocus: FocusEventHandler<HTMLTextAreaElement> | null = null,
        onBlur: (()=>void) | null = null;
    const TextArea = css`
        width: 100%;
        resize: none;
        display: block;
        font-size: 14px;
        color: var(--foreground);
        background: var(--secondary-background);
        padding: ${padding};
        line-height: ${lineHeight};
        ${hideBorder
            ? `border: none;`
            : `border-radius: var(--border-radius);
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
