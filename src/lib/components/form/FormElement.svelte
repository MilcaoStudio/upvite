<script lang="ts">
    import { getContext } from "svelte";
    import InputElement from "./InputElement.svelte";
    import type { FormContext, Value } from "$lib/types/Form";

    interface Props {
        id: string;
    }

    let { id }: Props = $props();
    const { schema, disabled, values, onChange, data } = getContext<FormContext>('form');
    const props = {
        type: schema[id],
        disabled,
        value: () => $values[id] as Value<typeof schema[typeof id]>,
        onChange: (value: string) => {
            values.update((v: Record<string, any>) => {v[id] = value; return v;});
            onChange?.($values, id);
        },
        ...data[id]
    }
</script>

<InputElement props={props} />