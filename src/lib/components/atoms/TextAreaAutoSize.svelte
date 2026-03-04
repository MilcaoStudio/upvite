<script lang="ts">
    import { run } from 'svelte/legacy';

    import { internalSubscribe } from "$lib/InternalEmitter";
    import { css, cx } from "@emotion/css";
    import TextArea from "./input/TextArea.svelte";
    import type {
        ChangeEventHandler,
        FocusEventHandler,
        KeyboardEventHandler,
    } from "svelte/elements";

    interface Props {
        autoFocus?: boolean;
        id?: string | undefined;
        minHeight?: number;
        maxRows?: number;
        value: string;
        padding?: string;
        lineHeight?: string;
        hideBorder?: boolean;
        forceFocus?: boolean;
        onChange: ChangeEventHandler<HTMLTextAreaElement>;
        onKeyUp?: KeyboardEventHandler<HTMLTextAreaElement> | null;
        onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | null;
        onFocus?: FocusEventHandler<HTMLTextAreaElement> | null;
        onBlur?: (() => void) | null;
        [key: string]: any
    }

    let {
        autoFocus = false,
        id = undefined,
        minHeight = 0,
        maxRows = 5,
        value,
        padding = "",
        lineHeight = "var(--textarea-line-height)",
        hideBorder = false,
        forceFocus = false,
        onChange,
        onKeyUp = null,
        onKeyDown = null,
        onFocus = null,
        onBlur = null,
        ...rest
    }: Props = $props();
    let ref: HTMLTextAreaElement | undefined = $state();
    let ghost: HTMLDivElement = $state();

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

    run(() => {
        if (forceFocus) {
            ref?.focus();
        }

        if (autoFocus && !inputSelected()) {
            ref?.focus();
        }
    });

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

<svelte:document onkeydown={keyDown} />

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
            {...rest}
        />
    </div>
</div>
