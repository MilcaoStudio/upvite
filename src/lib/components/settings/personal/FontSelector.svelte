<script lang="ts">
    import { state } from "$lib/State";
    import H3 from "$lib/components/atoms/heading/H3.svelte";
    import { FONTS, FONT_KEYS, type Fonts } from "$lib/components/context/Theme.svelte";
    import { t } from "svelte-i18n";
    import InputElement from "$lib/components/form/InputElement.svelte";

    let theme = state.settings.theme;
    let onChange = (value: string)=>theme.setFont(value as Fonts);
    let options = FONT_KEYS.map(font => ({value: font, name: FONTS[font as Fonts].name}));
</script>

<H3>{$t("app.settings.pages.appearance.font")}</H3>
<InputElement props={{type: "combo", value: () => theme.getFont(), onChange, options}} />