<script lang="ts">
    import type { ComponentProps } from "svelte";
    import InputBox from "./InputBox.svelte";
    import type { HTMLInputAttributes } from "svelte/elements";
    import Category from "../atoms/Category.svelte";

    export let props: HTMLInputAttributes & {onChange?: (value: string)=>void, field?: string};
    const { value, type, field, onChange, ..._props } = props;
    const v = typeof value == 'function' ? value() : value;
    let el: {component: ConstructorOfATypedSvelteComponent | null, props: ComponentProps<any>} = {component: null, props: {}}
    switch (type) {
        case 'text': {
            el.component = InputBox;
            el.props = {
                value: v as string,
                onChange: (ev: Event & {currentTarget: HTMLInputElement})=>onChange?.(ev.currentTarget?.value),
                ..._props
            }
            break;
        }
        default:
            break;
    }
</script>

<!-- Observer made in home -->
{#key props}
    {#if field}
    <div>
        <Category>{field}</Category>
        <svelte:component this={el.component} {...el.props} />
    </div>
    {:else}
    <svelte:component this={el.component} {...el.props} />
    {/if}
{/key}
