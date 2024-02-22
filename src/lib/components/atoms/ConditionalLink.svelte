<script lang="ts">
    import type { EventHandler } from "svelte/elements";

    export let active: boolean, onClick: EventHandler<MouseEvent|KeyboardEvent>=function(){}, href: string | undefined = undefined;
</script>

{#if active}
    <a on:click={onClick} on:keydown={onClick} {href} >
        <slot />
    </a>
{:else}
    <a {href} {...$$restProps}><slot /></a>
{/if}