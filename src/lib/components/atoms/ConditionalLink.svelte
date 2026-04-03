<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLAnchorAttributes } from "svelte/elements";

    interface Props extends HTMLAnchorAttributes {
        active: boolean;
        children?: Snippet;
    }

    let {
        active,
        href,
        children,
        ...props
    }: Props = $props();
    
</script>

{#if active}
    <span class={props.class}>
        {@render children?.()}
    </span>
{:else}
    <a {...props}>{@render children?.()}</a>
{/if}