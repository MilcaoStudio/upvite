<script lang="ts">
    import { getInitialValues, type FormTemplate, type MapFormToData, type MapFormToValues } from "$lib/types/Form";
    import type { Action, ButtonProps, Modal, ModalProps } from "$lib/types/Modal";
    import type { HTMLButtonAttributes } from "svelte/elements";
    import Dialog from "./Dialog.svelte";
    import Form from "../form/Form.svelte";
    import Category from "../atoms/Category.svelte";
    import Error from '../atoms/Error.svelte'
    import { _ } from "svelte-i18n";
    import { type Snippet } from "svelte";

    interface Props {
        schema: FormTemplate;
        data: MapFormToData<any>;
        defaults?: Partial<MapFormToValues<FormTemplate>> | undefined;
        callback: (values: any)=>Promise<void>;
        title?: string | undefined;
        submit: ButtonProps | undefined;
        submitBtn?: Omit<HTMLButtonAttributes, "type"> | undefined;
        actions?: Action[];
        description?: import('svelte').Snippet;
        [key: string]: any
    }

    let {
        schema,
        data,
        defaults = undefined,
        callback,
        title = undefined,
        submit,
        submitBtn = undefined,
        actions = [],
        description,
        ...rest
    }: Props = $props();
    let values: MapFormToValues<FormTemplate> = $derived(getInitialValues(schema, defaults));
    let error = $state(''), processing = $state(false);
    
    async function onSubmit() {
        try {
            processing = true;
            await callback(values);
            return true
        } catch (err) {
            error = ''+err;
            processing = false;
            return false
        }
    }

    function onChange(data: MapFormToData<FormTemplate>, key: string) {
        values[key] = data[key] as string;
    }
</script>

{#snippet submitText()}Submit{/snippet}
{#snippet cancel()}Cancel{/snippet}

<Dialog {...rest} {title} disabled={processing} actions={[
    {
        onClick: onSubmit,
        confirmation: true,
        children: submitText,
        ...submit,
    },
    ...actions,
    {
        onClick: ()=>true,
        confirmation: true,
        children: cancel,
    }
]}>
    {#snippet description()}
        {@render description?.()}
    {/snippet}
    <Form schema={schema} data={data} defaults={defaults} submitProps={submitBtn} observed={values} {onChange} >
        {#each Object.keys(schema) as key}
            {#if schema[key] == "snippet"}
                {@const snippet = values[key] as Snippet}
                {@render snippet()}
            {/if}
        {/each}
    </Form>
    {#if error}
        <Category><Error error={$_('error')}>{error}</Error></Category>
    {/if}
</Dialog>