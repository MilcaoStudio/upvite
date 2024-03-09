<script lang="ts">
    import { getInitialValues, type FormTemplate, type MapFormToValues, type FormProps, type MapFormToData } from "$lib/types/Form";
    import { _ } from "svelte-i18n";
    import Modal from "./Modal.svelte";
    import Form from "../form/Form.svelte";
    import Error from "../atoms/Error.svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";
    import type { Action } from "$lib/types/Modal";
    import Category from "../atoms/Category.svelte";

    
    export let schema: FormTemplate,
        data: MapFormToData<FormTemplate>,
        defaults: Partial<MapFormToValues<FormTemplate>> | undefined = undefined,
        callback: (values: MapFormToValues<FormTemplate>)=>Promise<void>,
        submit: Omit<HTMLButtonAttributes, "type"> & {children?: string} | undefined,
        submitBtn: Omit<HTMLButtonAttributes, "type"> & {children?: string} | undefined = undefined,
        actions: Action[] = [{
            onClick: () => true,
            children: "Cancel",
            palette: "plain",
        }];
    const values = getInitialValues(schema, defaults);
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
</script>

<Modal {...$$restProps} disabled={processing} actions={[
    {
        onClick: onSubmit,
        children: "Submit",
        confirmation: true,
        ...submit,
    },
    ...actions,
]} >
    <svelte:fragment slot="title"><slot name="title" /></svelte:fragment>
    <svelte:fragment slot="description"><slot name="description" /></svelte:fragment>
    <Form schema={schema} data={data} defaults={defaults} submitBtn={submitBtn} observed={values}>
        <svelte:fragment slot="submit">{submitBtn?.children}</svelte:fragment>
    </Form>
    {#if error}
        <Category><Error error={$_('error')}>{error}</Error></Category>
    {/if}
</Modal>