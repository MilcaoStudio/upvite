<script lang="ts">
    import Tree from "$lib/components/Tree.svelte";
    import type { Node } from "$lib/components/Tree.svelte";
    import { json } from "svelte-i18n";

    export let id: string, fields: Record<string, Node> = {};

    function recursiceReplaceSlots(input: string, _fields: Record<string, Node>): (string|Node)[] {
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
        <Tree node={fragment} /> 
    {/each}
{/if}
