<script lang="ts">
    import { getInitialValues, type FormTemplate, type MapFormToData, type MapFormToValues } from "$lib/types/Form";
    import type { Action, Modal, ModalProps } from "$lib/types/Modal";
    import type { HTMLButtonAttributes } from "svelte/elements";
    import Dialog from "./Dialog.svelte";
    import Form from "../form/Form.svelte";
    import Category from "../atoms/Category.svelte";
    import Error from '../atoms/Error.svelte'
    import { _ } from "svelte-i18n";

    export let schema: FormTemplate,
        data: MapFormToData<FormTemplate>,
        defaults: Partial<MapFormToValues<FormTemplate>> | undefined = undefined,
        callback: (values: MapFormToValues<FormTemplate>)=>Promise<void>,
        title: string | undefined = undefined,
        submit: Omit<HTMLButtonAttributes, "type"> & {children?: string} | undefined,
        submitBtn: Omit<HTMLButtonAttributes, "type"> & {children?: string} | undefined = undefined,
        actions: Action[] = [{
            onClick: () => true,
            children: "Cancel",
            palette: "plain",
        }];
    export let props: ModalProps<Modal["type"]>;
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

<Dialog {...props} {title} disabled={processing} actions={[
    {
        onClick: onSubmit,
        children: "Submit",
        confirmation: true,
        ...submit,
    },
    ...actions,
]} open>
    <svelte:fragment slot="description"><slot name="description" /></svelte:fragment>
    <Form schema={schema} data={data} defaults={defaults} submitBtn={submitBtn} observed={values}>
        <svelte:fragment slot="submit">{submitBtn?.children}</svelte:fragment>
    </Form>
    {#if error}
        <Category><Error error={$_('error')}>{error}</Error></Category>
    {/if}
</Dialog>