<script lang="ts">
    import { state } from "$lib/State";
    import H3 from "$lib/components/atoms/heading/H3.svelte";
    import { type MonospaceFonts, MONOSPACE_FONT_KEYS, MONOSPACE_FONTS } from "$lib/components/context/Theme.svelte";
    import { t } from "svelte-i18n";
    import InputElement from "$lib/components/form/InputElement.svelte";

    let theme = state.settings.theme;
    let onChange = (value: string)=>theme.setMonospaceFont(value as MonospaceFonts);
    let options = MONOSPACE_FONT_KEYS.map(font => ({value: font, name: MONOSPACE_FONTS[font as MonospaceFonts].name}));
</script>

<H3>{$t("app.settings.pages.appearance.mono_font")}</H3>
<InputElement props={{type: "combo", value: () => theme.getMonospaceFont(), onChange, options}} />