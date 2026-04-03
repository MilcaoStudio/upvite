<script module>
    /**
     * EXPERIMENTAL
     * 
     * This function returns a simple snippet, useful for rendering raw text.
     * 
     * If `render` returns a raw text instead of an html fragment, svelte may throw a warning.
     * @returns Snippet<[]>
     */
    export function createTextSnippet(render:()=>string){
        return createRawSnippet(()=>({render}));
    }
</script>

<script lang="ts">
    import { createRawSnippet, type Snippet } from "svelte";
    import { json } from "svelte-i18n";

    interface Props {
        id: string;
        fields?: Record<string, Snippet>;
    }

    let { id, fields = {} }: Props = $props();

    function recursiceReplaceSlots(input: string, _fields: Record<string, Snippet>): (string|Snippet)[] {
        const key = Object.keys(_fields)[0];
        if (key) {
            const { [key]: field, ...restOfFields } = _fields;
            if (!field) return [input];
            const values = input.split(`{{${key}}}`).map(v=>recursiceReplaceSlots(v, restOfFields));

            for (let i = values.length - 1; i > 0; i -= 2) {
                values.splice(i, 0, [field]);
            }
            return values.flat();
        }
        return [input]
    }

    let definition = $derived($json(id))
</script>

{#if typeof definition == 'string'}
    {#each recursiceReplaceSlots(definition, fields) as fragment}
        {#if typeof fragment == "string"}
            {fragment}
        {:else}
            {@const t = typeof fragment}
            {@debug t}
            {@render fragment()}
        {/if}
    {/each}
{/if}
