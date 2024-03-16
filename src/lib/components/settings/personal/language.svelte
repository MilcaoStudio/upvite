<script>
    import { state } from "$lib/State";
    import InDevelopment from "$lib/components/atoms/inDevelopment.svelte";
    import RadioLanguage from "$lib/components/atoms/input/RadioLanguage.svelte";
    import { Languages } from "external/lang/Languages";
    let group = state.locale.getLanguage();
    function update() {
        state.locale.setLanguage(group);
    }
</script>

<div class="base">
    <InDevelopment />
    {#each Object.entries(Languages) as [locale, entry]}
        <RadioLanguage bind:group value={locale} >
            <div slot="svg">
                {entry.emoji}
            </div>
            {entry.display}
        </RadioLanguage>
    {/each}
</div>

<style>
    .base{
        display: flex;
        gap:12px;
        flex-direction: column;
    }
</style>