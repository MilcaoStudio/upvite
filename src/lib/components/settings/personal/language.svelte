<script>
    import InDevelopment from "$lib/components/atoms/inDevelopment.svelte";
import RadioLanguage from "$lib/components/atoms/input/RadioLanguage.svelte";
    import Emoji from "$lib/markdown/plugins/Emoji.svelte";

</script>




<div class="base">
    <InDevelopment></InDevelopment>

    <RadioLanguage>
        <div slot="svg"><Emoji match="🇨🇱"></Emoji></div>
        Xhileno
    </RadioLanguage>

    <RadioLanguage>
        <div slot="svg"><Emoji match="🇭🇹"></Emoji></div>
        Haitiano
    </RadioLanguage>

    <RadioLanguage>
        <div slot="svg"><Emoji match="🇦🇷"></Emoji></div>
        Racista/femboy
    </RadioLanguage>

    <RadioLanguage>
        <div slot="svg"><Emoji match="🇸🇪"></Emoji></div>
        Mojang Studios
    </RadioLanguage>
    
    <RadioLanguage>
        <div slot="svg"><Emoji match="🇪🇸"></Emoji></div>
        Español (castellano)
    </RadioLanguage>

    <RadioLanguage>
        <div slot="svg"><Emoji match="🇨🇱"></Emoji></div>
        Haitiano (chileno)
    </RadioLanguage>
</div>



<style>
    .base{
        display: flex;
        gap:12px;
        flex-direction: column;
    }
</style>