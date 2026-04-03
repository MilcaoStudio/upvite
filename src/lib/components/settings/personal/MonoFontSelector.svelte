<script lang="ts">
    import H3 from "$lib/components/atoms/heading/H3.svelte";
    import { type MonospaceFonts, MONOSPACE_FONT_KEYS, MONOSPACE_FONTS } from "$lib/components/context/Theme.svelte";
    import { t } from "svelte-i18n";
    import InputElement from "$lib/components/form/InputElement.svelte";
    import { useState } from "$lib/components/state/StateContext.svelte";

    let theme = useState().settings.theme;
    let onChange = (value: string)=>theme.setMonospaceFont(value as MonospaceFonts);
    let options = MONOSPACE_FONT_KEYS.map(font => ({value: font, name: MONOSPACE_FONTS[font as MonospaceFonts].name}));
</script>

<H3>{$t("app.settings.pages.appearance.mono_font")}</H3>
<InputElement props={{type: "combo", value: () => theme.getMonospaceFont(), onChange, options}} />