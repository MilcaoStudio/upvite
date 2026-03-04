<script lang="ts">
    import { run } from 'svelte/legacy';

    import InputBox from "./InputBox.svelte";
    import type { HTMLInputAttributes } from "svelte/elements";
    import Category from "../atoms/Category.svelte";
    import ComboBox from "./ComboBox.svelte";
    import type { Choice } from "../../types/Form";
    import Column from "../atoms/layout/Column.svelte";
    import { RadioButton } from "fluent-svelte";
    import FileUploader from "$lib/controllers/FileUploader.svelte";
    import type { FileUploaderProps } from "$lib/types/FileUpload";

    interface Props {
        props: HTMLInputAttributes & Partial<FileUploaderProps> & {
        onChange?: (value: string) => void;
        field?: string;
        options?: Choice[];
    };
    }

    let { props }: Props = $props();
    const { value, type, field, onChange, options, ..._props } = props;
    let v;
    run(() => {
        v = typeof value == "function" ? value() : value;
    });
    run(() => {
        props.onChange?.(v);
    });
</script>

{#key props}
    {#if field}
        <Category>{field}</Category>
    {/if}
    {#if type == "combo" && options}
        <ComboBox
            value={v}
            onChange={(ev) => onChange?.(ev.currentTarget?.value)}
            {..._props}
        >
            {#each options as option (option.value)}
                <option value={option.value}>
                    {option.name}
                </option>
            {/each}
        </ComboBox>
    {:else if type == "radio" && props.options}
    <Column>
        {#each props.options as option (option.value)}
            <RadioButton bind:group={v} value={option.value}>{option.name}</RadioButton>
        {/each}
    </Column>
    {:else if type == "text" || type == "password"}
        <InputBox {type} value={v} onChange={ev=>onChange?.(ev.currentTarget.value)} {..._props} />
    <!-- TODO: Add props for FileUploader
    {:else if type == "file"}
        <FileUploader {..._props} />
        -->
    {/if}
{/key}
