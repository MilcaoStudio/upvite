<script lang="ts">
    import { css, cx } from "@emotion/css";
    import type { ChangeEventHandler, HTMLInputAttributes, KeyboardEventHandler } from "svelte/elements";

    export let props: HTMLInputAttributes & {
        palette?: "primary" | "secondary";
    } = { palette: "primary" }, onChange: ChangeEventHandler<HTMLInputElement> = function(){};
    $: InputBox = cx(
        "InputBox",
        css`
            width: 100%;
            padding: 11px 16px;
            font-size: 0.9375rem;
            font-family: inherit;
            font-weight: 500;
            border: none;
            border-radius: var(--border-radius);
            box-sizing: border-box;
            outline: none;
            transition: 0.1s ease-in-out all;
            ${
                props.palette == "primary"
                    ? `
                color: var(--foreground);
                background: var(--primary-background);
            `
                    : `
                color: var(--secondary-foreground);
                background: var(--secondary-background);
            `
            }
            &:disabled {
                filter: brightness(0.9);
            }
            &:focus-visible {
                box-shadow: 0 0 0 1.5pt var(--accent);
            }
            &:hover {
                background: ${
                    props.palette == "primary"
                        ? "var(--secondary-background)"
                        : "var(--hover)"
                };
            }
        }`,
    );
</script>

<!--TextBox is not recommended because it does not listen to change events-->
<div class="text-box-container">
    <input class={InputBox} {...props} {...$$restProps} on:change={props["on:change"]} on:change={onChange} on:keyup={onChange} />
    <div class="text-box-underline" />
</div>
