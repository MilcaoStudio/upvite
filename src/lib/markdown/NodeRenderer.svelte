<script lang="ts">
    import Self from "./NodeRenderer.svelte"
    import type { SVNode } from "./runtime/svelteRuntime";

    interface Props {
        node: SVNode,
    }

    let { node }: Props = $props();
</script>

{#if node.type == "text"}
    {node.value}
{:else if node.type == "element"}
    {#if node.children}
        <svelte:element this={node.tagName} {...node.props}>
            {#each node.children as child}
                <Self node={child} />
            {/each}
        </svelte:element>
    {:else}
        <svelte:element this={node.tagName} {...node.props} />
    {/if}
{:else if node.type == "component"}
    {#if node.children}
        <node.component {...node.props}>
            {#each node.children as child}
                <Self node={child} />
            {/each}
        </node.component>
    {:else}
        <node.component {...node.props} />
    {/if}
{/if}