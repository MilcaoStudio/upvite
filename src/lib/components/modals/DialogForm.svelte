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

    export let schema: FormTemplate,
        data: MapFormToData<any>,
        defaults: Partial<MapFormToValues<FormTemplate>> | undefined = undefined,
        callback: (values: MapFormToValues<FormTemplate>)=>Promise<void>,
        title: string | undefined = undefined,
        submit: Omit<HTMLButtonAttributes, "type"> & ButtonProps & {children?: string} | undefined,
        submitBtn: Omit<HTMLButtonAttributes, "type"> & {children?: string} | undefined = undefined,
        actions: Action[] = [{
            onClick: () => true,
            children: "Cancel",
            palette: "plain",
        }];
    let values: MapFormToValues<FormTemplate> = getInitialValues(schema, defaults);
    let error = '', processing = false;
    
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

<Dialog {...$$restProps} {title} disabled={processing} actions={[
    {
        onClick: onSubmit,
        children: "Submit",
        confirmation: true,
        ...submit,
    },
    ...actions,
]}>
    <svelte:fragment slot="description"><slot name="description" /></svelte:fragment>
    <Form schema={schema} data={data} defaults={defaults} submitBtn={submitBtn} observed={values} {onChange} >
        <svelte:fragment slot="submit">{submitBtn?.children}</svelte:fragment>
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