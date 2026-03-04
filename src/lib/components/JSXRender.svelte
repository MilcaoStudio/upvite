<script lang="ts">
    import JSXRender from './JSXRender.svelte';
    import type { SvelteNode } from "$lib/markdown/runtime/svelteRuntime";

    interface Props {
        node: SvelteNode;
        children?: import('svelte').Snippet;
    }

    let { node, children }: Props = $props();
    let props = $derived(typeof node == "object" && node?.props || null);
    let children = $derived(props?.children ? Array.isArray(props.children) ? props.children : [props.children] : undefined);
</script>

{#if node}
    {#if typeof node != 'object'}
        {node}
    {:else}
        {#if typeof node.type == 'string'}
            {#if children}
                <svelte:element this={node.type} {...node.props} >
                    {#each children as child}
                        <JSXRender node={child} />
                    {/each}
                </svelte:element>
            {:else}
                <svelte:element this={node.type} {...node.props} />
            {/if}
        {:else}
            {#if children}
                <node.type {...node.props} >
                    {#each children as child}
                        <JSXRender node={child} />
                    {/each}
                    {@render children?.()}
                </node.type>
            {:else}
                <node.type {...node.props} />
            {/if}
        {/if}
    {/if}
{/if}
