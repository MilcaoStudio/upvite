<script lang="ts">
    import { getInitialValues, type FormTemplate, type MapFormToData, type MapFormToValues } from "$lib/types/Form";
    import { setContext } from "svelte";
    import Column from "../atoms/layout/Column.svelte";
    import FormElement from "./FormElement.svelte";
    import Button from "../atoms/Button.svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";

    type T = FormTemplate;
    export let schema: T,
        data: MapFormToData<T>,
        disabled: boolean = false,
        onChange: (data: MapFormToValues<T>, key: keyof T) => void = function(){},
        onSubmit: (data: MapFormToValues<T>) => void = function(){},
        observed: MapFormToValues<T> | undefined = undefined,
        defaults: Partial<MapFormToValues<T>> | undefined = undefined,
        submitBtn: Omit<HTMLButtonAttributes, "type"> | undefined = undefined;

    $: keys = Object.keys(schema);
    let values: MapFormToValues<T>;
    $: {
        values = observed ?? getInitialValues(schema, defaults);
        setContext('form', {schema, disabled, values, onChange, data })
    }
    $: submit = function(){
        onSubmit?.(values)
    };
    
</script>

<form on:submit|preventDefault>
    <Column>
        <slot name="field">
            {#each keys as key}
                <FormElement id={key} />
            {/each}
        </slot>
        <slot />
        {#if submitBtn}
            <Button props={{type: "submit", disabled, ...submitBtn}}>
                <slot name="submit">Submit</slot>
            </Button>
        {/if}
    </Column>
</form>