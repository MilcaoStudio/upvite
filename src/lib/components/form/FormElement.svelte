<script lang="ts">
    import { getContext } from "svelte";
    import InputElement from "./InputElement.svelte";
    import type { FormContext, Value } from "$lib/types/Form";

    export let id: string;
    const { schema, disabled, values, onChange, data } = getContext<FormContext>('form');
    const props = {
        type: schema[id],
        disabled,
        value: () => values[id] as Value<typeof schema[typeof id]>,
        onChange: (value: string) => {
            values[id as keyof typeof values] = value;
            onChange?.(values, id);
        },
        ...data[id]
    }
</script>

<InputElement props={props} />