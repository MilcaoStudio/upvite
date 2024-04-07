<script lang="ts">
    import InputBox from "./InputBox.svelte";
    import type { HTMLInputAttributes } from "svelte/elements";
    import Category from "../atoms/Category.svelte";
    import ComboBox from "./ComboBox.svelte";
    import type { Choice } from "../../types/Form";

    export let props: HTMLInputAttributes & {
        onChange?: (value: string) => void;
        field?: string;
        options?: Choice[];
    };
    const { value, type, field, onChange, options, ..._props } = props;
    $: v = typeof value == "function" ? value() : value;
</script>

<!-- Observer made in home -->
<!--
{#key props}
    {#if field}
    <div>
        <Category>{field}</Category>
        <svelte:component this={el.component} {...el.props} />
    </div>
    {:else}
    <svelte:component this={el.component} {...el.props} />
    {/if}
{/key}
-->
{#key props}
    {#if field}
        <Category>{field}</Category>
    {/if}
    {#if type == "combo" && options}
        <ComboBox
            value={v}
            onChange={(ev) => onChange?.(ev.currentTarget?.value)}
            {..._props}
        >
            {#each options as option (option.value)}
                <option value={option.value}>
                    {option.name}
                </option>
            {/each}
        </ComboBox>
    {:else if type == "text" || type == "password"}
        <InputBox {type} value={v} onChange={ev=>onChange?.(ev.currentTarget.value)} {..._props} />
    {/if}
{/key}
