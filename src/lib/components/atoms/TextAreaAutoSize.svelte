<script lang="ts">
    import { isTouchscreenDevice } from "$lib";
    import { internalSubscribe } from "$lib/InternalEmitter";
    import { css, cx } from "@emotion/css";
    import TextArea from "./input/TextArea.svelte";
    import type { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler } from "svelte/elements";

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
        onKeyUp: KeyboardEventHandler<HTMLTextAreaElement>,
        onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>,
        onFocus: FocusEventHandler<HTMLTextAreaElement>,
        onBlur: ()=>void;
    let ref: HTMLTextAreaElement | undefined;


    // No editable
    const Ghost = css`
        flex: 0;
        width: 100%;
        overflow: hidden;
        visibility: hidden;
        position: relative;

        > div {
            width: 100%;
            white-space: pre-wrap;
            word-break: break-all;

            top: 0;
            position: absolute;
            font-size: var(--text-size);
            line-height: ${lineHeight};
            max-height: calc(calc(${lineHeight} * ${maxRows}))
        }`;
    const AutoSize = cx("AutoSize", css`flex-grow: 1;display: flex; flex-direction: column; padding: var(--message-box-padding);`)
    $: if (Ghost && ref && value) {
        ref.style.height = `${Ghost.clientHeight + 10}px`;
        ref.style.minHeight = `${minHeight}px`;

    }

    // Call adjustTextareaHeight whenever the value changes
    $: adjustTextareaHeight();

    function inputSelected(){
        return ["TEXTAREA", "INPUT"].includes(document.activeElement?.nodeName ?? "")
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

    internalSubscribe("TextArea", "focus", focus as (...args: unknown[]) => void);
</script>

<svelte:document on:keydown={keyDown} />


<div class={AutoSize} >
    <TextArea bind:ref={ref} {id} {value} {padding} {hideBorder} {lineHeight} onChange={(ev) =>

        onChange && onChange(ev)
    } {onKeyUp} {onKeyDown} {onFocus} {onBlur} {...$$restProps} />
</div>
