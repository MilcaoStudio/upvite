<script lang="ts">
    import { run, preventDefault } from 'svelte/legacy';

    import { getInitialValues, type FormTemplate, type MapFormToData, type MapFormToValues } from "$lib/types/Form";
    import { setContext } from "svelte";
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
        submitBtn?: Omit<HTMLButtonAttributes, "type"> | undefined;
        field?: import('svelte').Snippet;
        children?: import('svelte').Snippet;
        submit?: import('svelte').Snippet;
    }

    let {
        schema,
        data,
        disabled = false,
        onChange = function(){},
        onSubmit = function(){},
        observed = undefined,
        defaults = undefined,
        submitBtn = undefined,
        field,
        children,
        submit
    }: Props = $props();

    let keys = $derived(Object.keys(schema));
    let values = writable(observed ?? getInitialValues(schema, defaults));
    run(() => {
        setContext('form', {schema, disabled, values, onChange, data })
    });
</script>

<form onsubmit={preventDefault(() => onSubmit?.($values))}>
    <Column>
        {#if field}{@render field()}{:else}
            {#each keys as key}
                <FormElement id={key} />
            {/each}
        {/if}
        {@render children?.()}
        {#if submitBtn}
            <Button props={{type: "submit", disabled, ...submitBtn}}>
                {#if submit}{@render submit()}{:else}Submit{/if}
            </Button>
        {/if}
    </Column>
</form>