<script lang="ts">
    import { state } from "$lib/State";
    import TextAreaAutoSize from "$lib/components/atoms/TextAreaAutoSize.svelte";
    import H3 from "$lib/components/atoms/heading/H3.svelte";
    import FileReader from "$lib/controllers/FileReader.svelte";
    import { t } from "svelte-i18n";
    let theme = state.settings.theme;
    let value = theme.getCSS();
</script>

<H3>{$t("app.settings.pages.appearance.custom_css")}</H3>
<TextAreaAutoSize
    maxRows={20}
    minHeight={300}
    code
    value={value ?? ""}
    onChange={(ev) => theme.setCSS(ev.currentTarget.value)}
/>
<FileReader accept="text/css" onChange={async (file)=>{
    value = await file.text();
    theme.setCSS(value);
}} />