<script lang="ts">
    import { internalSubscribe } from "$lib/InternalEmitter";
    import { css, cx } from "@emotion/css";
    import TextArea from "./input/TextArea.svelte";
    import type {
        ChangeEventHandler,
        FocusEventHandler,
        KeyboardEventHandler,
    } from "svelte/elements";

    export let autoFocus = false,
        id: string | undefined = undefined,
        minHeight = 0,
        maxRows = 5,
        value: string,
        padding = "",
        lineHeight = "var(--textarea-line-height)",
        hideBorder = false,
        forceFocus = false,
        onChange: ChangeEventHandler<HTMLTextAreaElement>,
        onKeyUp: KeyboardEventHandler<HTMLTextAreaElement> | null = null,
        onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> | null = null,
        onFocus: FocusEventHandler<HTMLTextAreaElement> | null = null,
        onBlur: (() => void) | null = null;
    let ref: HTMLTextAreaElement | undefined;
    let ghost: HTMLDivElement;

    const AutoSize = cx(
        "AutoSize",
        css`
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            padding: var(--message-box-padding);
            > div {
                display: grid;
                min-height: ${minHeight}px;
                max-height: calc(${lineHeight} * ${maxRows});
                &::after {
                    content: attr(data-value) " ";
                    white-space: pre-wrap;
                    visibility: hidden;
                    grid-row: 1;
                    grid-column: 1;
                }

                textarea {
                    min-height: ${minHeight}px;
                }
            }
        `,
    );
    

    function growUp() {
        ghost.dataset.value = ref?.value;
    }

    function inputSelected() {
        return ["TEXTAREA", "INPUT"].includes(
            document.activeElement?.nodeName ?? "",
        );
    }

    $: {
        if (forceFocus) {
            ref?.focus();
        }

        if (autoFocus && !inputSelected()) {
            ref?.focus();
        }
    }

    function keyDown(e: KeyboardEvent) {
        if ((e.ctrlKey && e.key != "v") || e.altKey || e.metaKey) return;
        if (e.key.length != 1) return;
        if (ref && !inputSelected()) {
            ref?.focus();
        }
    }

    function focus(_id: string) {
        if (_id == id) {
            ref?.focus();
        }
    }

    internalSubscribe(
        "TextArea",
        "focus",
        focus as (...args: unknown[]) => void,
    );
</script>

<svelte:document on:keydown={keyDown} />

<div class={AutoSize}>
    <div bind:this={ghost}>
        <TextArea
            bind:ref
            {id}
            {value}
            {padding}
            {hideBorder}
            {lineHeight}
            onChange={(ev) => onChange?.(ev)}
            onKeyUp={(ev) => {
                growUp();
                onKeyUp?.(ev);
            }}
            {onKeyDown}
            {onFocus}
            {onBlur}
            {...$$restProps}
        />
    </div>
</div>
