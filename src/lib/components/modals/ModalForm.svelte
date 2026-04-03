<script lang="ts">
    import { getInitialValues, type FormTemplate, type MapFormToValues, type FormProps, type MapFormToData } from "$lib/types/Form";
    import { _ } from "svelte-i18n";
    import Modal from "./Modal.svelte";
    import Form from "../form/Form.svelte";
    import Error from "../atoms/Error.svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";
    import type { Action } from "$lib/types/Modal";
    import Category from "../atoms/Category.svelte";

    
    interface Props {
        schema: FormTemplate;
        data: MapFormToData<FormTemplate>;
        defaults?: Partial<MapFormToValues<FormTemplate>> | undefined;
        callback: (values: MapFormToValues<FormTemplate>)=>Promise<void>;
        submit: Omit<HTMLButtonAttributes, "type"> | undefined;
        submitBtn?: Omit<HTMLButtonAttributes, "type"> & {children?: string} | undefined;
        actions?: Action[];
        title?: import('svelte').Snippet;
        description?: import('svelte').Snippet;
        [key: string]: any
    }

    let {
        schema,
        data,
        defaults = undefined,
        callback,
        submit,
        submitBtn = undefined,
        actions = [{
            onClick: () => true,
            palette: "plain",
        }],
        title,
        description,
        ...rest
    }: Props = $props();
    const values = $derived(getInitialValues(schema, defaults));
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
</script>

<Modal {...rest} disabled={processing} actions={[
    {
        onClick: onSubmit,
        confirmation: true,
        ...submit,
    },
    ...actions,
]} >
    {#snippet title()}
        {@render title?.()}
    {/snippet}
    {#snippet description()}
        {@render description?.()}
    {/snippet}
    <Form schema={schema} data={data} defaults={defaults} submitProps={submitBtn} observed={values}>
        {#snippet submit()}
                {submitBtn?.text}
            {/snippet}
    </Form>
    {#if error}
        <Category><Error error={$_('error')}>{error}</Error></Category>
    {/if}
</Modal>