<script lang="ts">
    import { goto } from '$app/navigation';
    import Appearance from '$lib/components/settings/personal/appearance.svelte';
    import Profile from '$lib/components/settings/personal/profile.svelte';
    import type { ComponentType } from 'svelte';
    
    const Pages: Record<string, ComponentType> = {
        profile: Profile,
        appearance: Appearance,
    }
    export let data;
    let tab = data.tab;
    if (!tab) {
        goto("/settings/profile");
    }
</script>

{#if tab}
    <svelte:component this={Pages[tab]} />
{/if}