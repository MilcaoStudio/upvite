<script module lang="ts">
    const [getFormContext, setFormContext] = createContext<FormContext>();

    export function useForm() {
        return getFormContext();
    }
</script>

<script lang="ts">
    import { getInitialValues, type FormContext, type FormProps, type FormTemplate, type MapFormToData, type MapFormToValues } from "$lib/types/Form";
    import { createContext, setContext, type Snippet } from "svelte";
    import Column from "../atoms/layout/Column.svelte";
    import FormElement from "./FormElement.svelte";
    import Button from "../atoms/Button.svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";
    import { writable } from "svelte/store";

    type T = FormTemplate;
    interface Props {
        schema: T;
        data: MapFormToData<T>;
        disabled?: boolean;
        onChange?: (data: MapFormToValues<T>, key: keyof T) => void;
        onSubmit?: (data: MapFormToValues<T>) => void;
        observed?: MapFormToValues<T> | undefined;
        defaults?: Partial<MapFormToValues<T>> | undefined;
        submitProps?: Omit<HTMLButtonAttributes, "type"> | undefined;
        field?: Snippet;
        children?: Snippet;
        submit?: Snippet;
    }

    let {
        schema,
        data,
        disabled = false,
        onChange = function(){},
        onSubmit = function(){},
        observed = undefined,
        defaults = undefined,
        submitProps = undefined,
        field,
        children,
        submit
    }: Props = $props();

    let keys = $derived(Object.keys(schema));
    let values = $derived(writable(observed ?? getInitialValues(schema, defaults)));
    $effect(() => {
        setFormContext({schema, disabled, values, onChange, data })
    });
</script>

<form onsubmit={(ev) => {ev.preventDefault();onSubmit?.($values)}}>
    <Column>
        {#if field}{@render field()}{:else}
            {#each keys as key}
                <FormElement id={key} />
            {/each}
        {/if}
        {@render children?.()}
        {#if submitProps}
            <Button type="submit" {disabled} {...submitProps}>
                {#if submit}
                    {@render submit()}
                {:else}
                    Submit
                {/if}
            </Button>
        {/if}
    </Column>
</form>