<script lang="ts">
    import type { EventHandler } from "svelte/elements";

    export let active: boolean, onClick: EventHandler<MouseEvent|KeyboardEvent>=function(){}, href: string | undefined = undefined;
    let className = "";
    export {className as class}
</script>

{#if active}
    <!-- svelte-ignore a11y-missing-attribute -->
    <a role="none" class={className} on:click={onClick} on:keydown={onClick} >
        <slot />
    </a>
{:else}
    <a class={className} {href} {...$$restProps}><slot /></a>
{/if}