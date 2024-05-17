<script lang="ts">
    import Tree from "$lib/components/JSXRender.svelte";
    import type { SvelteNode } from "$lib/markdown/runtime/svelteRuntime";
    import { json } from "svelte-i18n";

    export let id: string, fields: Record<string, SvelteNode> = {};

    function recursiceReplaceSlots(input: string, _fields: Record<string, SvelteNode>): (string|SvelteNode)[] {
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

    $: definition = $json(id)
</script>

{#if typeof definition == 'string'}
    {#each recursiceReplaceSlots(definition, fields) as fragment}
        <Tree node={fragment} /> 
    {/each}
{/if}
