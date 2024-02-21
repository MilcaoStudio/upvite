<script lang="ts">
    import { json } from "svelte-i18n";

    type Field =  {base: ConstructorOfATypedSvelteComponent | keyof HTMLElementTagNameMap, props?: any};
    export let id: string, fields: Record<string, Field> = {};

    function recursiceReplaceSlots(input: string, _fields: Record<string, Field>): (string|Field)[] {
        const key = Object.keys(_fields)[0];
        if (key) {
            const { [key]: field, ...restOfFields } = _fields;
            if (!field) return [input];
            const values = input.split(`{{${key}}}`).map(v=>recursiceReplaceSlots(v, restOfFields)).flat();

            for (let i = values.length - 1; i > 0; i -= 2) {
                values.splice(i, 0, field);
            }
            return values
        }
        return [input]
    }

    $: value = $json(id)
</script>

{#if typeof value == 'string'}
    {#each recursiceReplaceSlots(value, fields) as fragment}
        {#if typeof fragment != "object"}
            {fragment}
        {:else if typeof fragment.base == "string"}
            <svelte:element this={fragment.base} {...fragment.props}>
                {fragment.props.children}
            </svelte:element>
        {:else}
            <svelte:component this={fragment.base} {...fragment.props}>
                {fragment.props.children}
            </svelte:component>
        {/if}
    {/each}
{/if}
