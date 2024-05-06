<script lang="ts">
    import { css, cx } from "@emotion/css";
    import { t } from "svelte-i18n";
    import type { ChangeEventHandler } from "svelte/elements";

    export let palette: "primary" | "secondary" = "primary", onChange: ChangeEventHandler<HTMLInputElement> = function(){}, type: HTMLInputElement["type"];
    let showPassword = false;
    $: revealText = showPassword ? $t("app.special.modals.actions.hide") : $t("app.special.modals.actions.reveal");
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
                palette == "primary"
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
                    palette == "primary"
                        ? "var(--secondary-background)"
                        : "var(--hover)"
                };
            }
        }`,
    );

    function togglePasswordReveal() {
        showPassword = !showPassword;
        // "spy" type does not exist, then any browser has to render this type as "text" type
        type = showPassword ? "spy" : "password";
    }
</script>

<!--TextBox is not recommended because it does not listen to change events-->
<div class="text-box-container">
    <input class={InputBox} {type} {...$$restProps} on:change={onChange} on:keyup={onChange}  />
    {#if type == "password" || type == "spy"}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <span class="eye">
            <a on:click={togglePasswordReveal} on:keydown={togglePasswordReveal}>{revealText}</a>
        </span>
        
    {/if}
    <div class="text-box-underline" />
</div>

<style>
    .text-box-container {
        position: relative;
    }
    .eye {
        position: absolute;
        right: 0px;
        top: 0px;
        padding: 0.75rem;
    }
</style>