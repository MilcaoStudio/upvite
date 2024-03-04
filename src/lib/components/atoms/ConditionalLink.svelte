<script lang="ts">
    import type { EventHandler } from "svelte/elements";

    export let active: boolean, onClick: EventHandler<MouseEvent|KeyboardEvent>=function(){}, href: string | undefined = undefined;
</script>

{#if active}
    <!-- svelte-ignore a11y-missing-attribute -->
    <a role="none" on:click={onClick} on:keydown={onClick} >
        <slot />
    </a>
{:else}
    <a {href} {...$$restProps}><slot /></a>
{/if}