<script lang="ts">
    import { css, cx } from "@emotion/css";
    import { t } from "svelte-i18n";
    import type { ChangeEventHandler } from "svelte/elements";

    
    interface Props {
        class?: string | null;
        palette?: "primary" | "secondary";
        onChange?: ChangeEventHandler<HTMLInputElement>;
        type: HTMLInputElement["type"];
        padding?: boolean;
        [key: string]: any
    }

    let {
        class: className = "",
        palette = "primary",
        onChange = function(){},
        type = $bindable(),
        padding = true,
        ...rest
    }: Props = $props();
    let showPassword = $state(false);
    let revealText = $derived(showPassword ? $t("app.special.modals.actions.hide") : $t("app.special.modals.actions.reveal"));
    let InputBox = $derived(cx(
        "InputBox",
        css`
            width: 100%;
            font-size: 0.9375rem;
            font-family: inherit;
            font-weight: 500;
            border: none;
            box-sizing: border-box;
            outline: none;
            transition: 0.1s ease-in-out all;
            ${padding ? "padding: 11px 16px; border-radius: var(--border-radius);" : "padding: 4px; border-radius: 3px;"}
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
    ));

    function togglePasswordReveal() {
        showPassword = !showPassword;
        // "spy" type does not exist, then any browser has to render this type as "text" type
        type = showPassword ? "spy" : "password";
    }
</script>

<!--TextBox is not recommended because it does not listen to change events-->
<div class="text-box-container">
    <input class="{InputBox} {className}" {type} {...rest} onchange={onChange} onkeyup={onChange}  />
    {#if type == "password" || type == "spy"}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_missing_attribute -->
        <span class="eye">
            <a onclick={togglePasswordReveal} onkeydown={togglePasswordReveal}>{revealText}</a>
        </span>
        
    {/if}
    <div class="text-box-underline"></div>
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