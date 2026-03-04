<script lang="ts">
    import { getInitialValues, type FormTemplate, type MapFormToData, type MapFormToValues } from "$lib/types/Form";
    import type { Action, ButtonProps, Modal, ModalProps } from "$lib/types/Modal";
    import type { HTMLButtonAttributes } from "svelte/elements";
    import Dialog from "./Dialog.svelte";
    import Form from "../form/Form.svelte";
    import Category from "../atoms/Category.svelte";
    import Error from '../atoms/Error.svelte'
    import { _ } from "svelte-i18n";
    import JsxRender from "../JSXRender.svelte";

    interface Props {
        schema: FormTemplate;
        data: MapFormToData<any>;
        defaults?: Partial<MapFormToValues<FormTemplate>> | undefined;
        callback: (values: any)=>Promise<void>;
        title?: string | undefined;
        submit: Omit<HTMLButtonAttributes, "type"> & ButtonProps & {children?: string} | undefined;
        submitBtn?: Omit<HTMLButtonAttributes, "type"> & {children?: string} | undefined;
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
        actions = [{
            onClick: () => true,
            children: "Cancel",
            palette: "plain",
        }],
        description,
        ...rest
    }: Props = $props();
    let values: MapFormToValues<FormTemplate> = $state(getInitialValues(schema, defaults));
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

<Dialog {...rest} {title} disabled={processing} actions={[
    {
        onClick: onSubmit,
        children: "Submit",
        confirmation: true,
        ...submit,
    },
    ...actions,
]}>
    {#snippet description()}
        {@render description?.()}
    {/snippet}
    <Form schema={schema} data={data} defaults={defaults} submitBtn={submitBtn} observed={values} {onChange} >
        {#snippet submit()}
                {submitBtn?.children}
            {/snippet}
        {#each Object.keys(schema) as key}
            {#if schema[key] == "custom"}
                <JsxRender node={data[key].element} />
            {/if}
        {/each}
    </Form>
    {#if error}
        <Category><Error error={$_('error')}>{error}</Error></Category>
    {/if}
</Dialog>