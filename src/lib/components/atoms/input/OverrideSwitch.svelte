<script lang="ts">
    import type { SwitchState } from "$lib/types/Form";
    import Switch from "./Switch.svelte";
    import Check from "svelte-boxicons/BxCheck.svelte";

    export let state: SwitchState,
        disabled = false,
        onChange: (state: SwitchState) => void;
</script>

<div
    role="radiogroup"
    aria-orientation="horizontal"
    aria-disabled={disabled}
    class="OverrideSwitch"
>
<Switch onClick={()=>onChange("Deny")} selected={state == "Deny"} state="Deny">
    X
</Switch>
<Switch onClick={()=>onChange("Neutral")} selected={state == "Neutral"} state="Neutral">
    /
</Switch>
<Switch onClick={()=>onChange("Allow")} selected={state == "Allow"} state="Allow">
    <Check size={16} />
</Switch>
</div>

<style>
    .OverrideSwitch {
        flex-shrink: 0;
        width: fit-content;

        display: flex;
        margin: 4px 0;
        font-size: 14px;
        overflow: hidden;
        border-radius: var(--border-radius-inner);
        background: var(--secondary-background);
        border: 1px solid var(--tertiary-background);
    }

    div[aria-disabled="true"] {
        pointer-events: none;
        opacity: 0.6;
    }
</style>
