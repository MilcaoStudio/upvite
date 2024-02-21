<script context="module" lang="ts">
    import type { ComponentProps, ComponentType, SvelteComponent } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";

    export type Node = string | Component | Element | null;
    export type Children = Node | Node[];
    export type Component = {
        element: ComponentType,
        props: ComponentProps<SvelteComponent> | null,
        children?: Children
    };
    export type Element = {
        element: string,
        props: Record<string, any> | null,
        children?: Children
    }

    export function createElement<T extends SvelteComponent, U extends HTMLElement>(element: ComponentType<T> | string, props: ComponentProps<T> | HTMLAttributes<U>, ...children: Node[]): Node {
        if (!element) throw TypeError('element must be a valid svelte component');
        if (typeof props != 'object') throw TypeError('props must be an object or null');
        return typeof element == 'string' ? createHTMLElement<U>(element, props, ...children) : {
            element,
            props,
            children,
        }
    };
    function createHTMLElement<T extends HTMLElement>(tag: string, props: HTMLAttributes<T> | null, ...children: Node[]): Node {
        if(typeof tag != 'string') {
            throw TypeError('tag must be a valid tag for HTML Element')
        }
        
        return {
            element: tag,
            props,
            children,
        }
    }
</script>

<script lang="ts">
    export let node: Node;
</script>

{#if node}
    {#if typeof node != 'object'}
        {node}
    {:else}
        {#if typeof node.element == 'string'}
            <svelte:element this={node.element} {...node.props} >
                {#if node.children}
                    {#if Array.isArray(node.children)}
                        {#each node.children as child}
                            <svelte:self node={child} />
                        {/each}
                    {:else}
                        <svelte:self node={node.children} />
                    {/if}
                {/if}
                <slot />
            </svelte:element>
        {:else}
            <svelte:component this={node.element} {...node.props} >
                {#if node.children}
                    {#if Array.isArray(node.children)}
                        {#each node.children as child}
                            <svelte:self node={child} />
                        {/each}
                    {:else}
                        <svelte:self node={node.children} />
                    {/if}
                    <slot />
                {/if}
            </svelte:component>
        {/if}
    {/if}
{/if}