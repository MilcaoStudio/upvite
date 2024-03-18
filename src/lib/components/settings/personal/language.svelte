<script>
    import { state } from "$lib/State";
    import InDevelopment from "$lib/components/atoms/inDevelopment.svelte";
    import RadioLanguage from "$lib/components/atoms/input/RadioLanguage.svelte";

    import { Languages } from "../../../../lang/Languages";
    let group = state.locale.getLanguage();
    let languages = Object.entries(Languages).sort(([localeA, _a],[localeB, _b])=>localeB == group ? 1 : (localeA.localeCompare(localeB)));
    let naturalLangs = languages.filter(([_, entry])=>!entry.cat)
    let conLangs = languages.filter(([_, entry])=>entry.cat);
    function update() {
        state.locale.setLanguage(group);
    }
</script>

<div class="base">
    <InDevelopment />
    {#each naturalLangs as [locale, entry]}
        <RadioLanguage bind:group value={locale} >
            <div slot="svg">
                {entry.emoji}
            </div>
            {entry.display}
        </RadioLanguage>
    {/each}
    CONLANGS
    {#each conLangs as [locale, entry]}
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