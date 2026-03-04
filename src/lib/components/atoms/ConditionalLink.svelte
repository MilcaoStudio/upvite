<script lang="ts">
    import type { EventHandler } from "svelte/elements";

    interface Props {
        active: boolean;
        onClick?: EventHandler<MouseEvent|KeyboardEvent>;
        href?: string | undefined;
        class?: string;
        children?: import('svelte').Snippet;
        [key: string]: any
    }

    let {
        active,
        onClick = function(){},
        href = undefined,
        class: className = "",
        children,
        ...rest
    }: Props = $props();
    
</script>

{#if active}
    <!-- svelte-ignore a11y_missing_attribute -->
    <a role="none" class={className} onclick={onClick} onkeydown={onClick} >
        {@render children?.()}
    </a>
{:else}
    <a class={className} {href} {...rest}>{@render children?.()}</a>
{/if}