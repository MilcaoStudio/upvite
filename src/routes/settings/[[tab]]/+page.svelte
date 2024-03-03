<script lang="ts">
    import Appearance from '$lib/components/settings/appearance.svelte';
    import Profile from '$lib/components/settings/profile.svelte';
    export let data;
    $: tab = data.tab;
    let page;
</script>

{#if tab == "appearance"}
<Appearance />
{:else}
<Profile />
{/if}