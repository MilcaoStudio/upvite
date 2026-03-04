<script lang="ts">
    import H3 from "$lib/components/atoms/heading/H3.svelte";
    import { FONTS, FONT_KEYS, type Fonts } from "$lib/components/context/Theme.svelte";
    import { t } from "svelte-i18n";
    import InputElement from "$lib/components/form/InputElement.svelte";
    import { settings } from "$lib/stores/Settings";

    let theme = settings.theme;
    let onChange = (value: string)=>theme.setFont(value as Fonts);
    let options = FONT_KEYS.map(font => ({value: font, name: FONTS[font as Fonts].name}));
</script>

<H3>{$t("app.settings.pages.appearance.font")}</H3>
<InputElement props={{type: "combo", value: () => theme.getFont(), onChange, options}} />