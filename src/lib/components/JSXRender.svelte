<script lang="ts">
    import type { SvelteNode } from "$lib/markdown/runtime/svelteRuntime";

    export let node: SvelteNode;
    $: props = typeof node == "object" && node?.props || null;
    $: children = props?.children ? Array.isArray(props.children) ? props.children : [props.children] : undefined;
</script>

{#if node}
    {#if typeof node != 'object'}
        {node}
    {:else}
        {#if typeof node.type == 'string'}
            <svelte:element this={node.type} {...node.props} >
            {#if children}
                {#each children as child}
                    <svelte:self node={child} />
                {/each}
            {/if}
            </svelte:element>
        {:else}
            {#if children}
                <svelte:component this={node.type} {...node.props} >
                    {#each children as child}
                        <svelte:self node={child} />
                    {/each}
                    <slot />
                </svelte:component>
            {:else}
                <svelte:component this={node.type} {...node.props} />
            {/if}
        {/if}
    {/if}
{/if}
