<script lang="ts">
    import { state } from "$lib/State";
    import TextAreaAutoSize from "$lib/components/atoms/TextAreaAutoSize.svelte";
    import H3 from "$lib/components/atoms/heading/H3.svelte";
    import FileReader from "$lib/controllers/FileReader.svelte";
    import FileWriter from "$lib/controllers/FileWriter.svelte";
    import { t } from "svelte-i18n";
    import { validateText } from "w3c-css-validator";

    let theme = state.settings.theme;
    let value = theme.getCSS();
    let enableValidator = true;
    let showWarnings = true;
    let syncRef: HTMLButtonElement | null = null;
    function sync() {
        theme.setCSS(value?.trim());
    }
</script>

<H3>{$t("app.settings.pages.appearance.custom_css")}</H3>
<TextAreaAutoSize
    maxRows={15}
    minHeight={300}
    code
    value={value ?? ""}
    onKeyUp={(ev) => (value = ev.currentTarget.value)}
    onKeyDown={(ev) => {
        if (ev.ctrlKey && ev.key == "s") {
            ev.preventDefault();
            if (syncRef) {
                syncRef.click();
                syncRef.disabled = true;
            }
        }
    }}
    onChange={(ev) => (value = ev.currentTarget.value)}
/>
{#if enableValidator && value}
    {#await validateText(value, {medium: "screen"}) then response}
        {#if !response.valid}
            {#each response.errors as error}
                <span style:color="var(--error)">Line {error.line}: {error.message}.</span>
            {/each}
        {/if}
    {/await}
{/if}

<div class="Actions">
    <button bind:this={syncRef} disabled={theme.getCSS()?.trim() == value?.trim()} on:click={sync}
        >Apply changes</button
    >
    <FileReader
        accept="text/css"
        onChange={async (file) => {
            value = await file.text();
        }}
    >
        {value?.length ? "Import and override" : "Import from file"}
    </FileReader>

    <FileWriter
        fileType="text/css"
        disabled={typeof value == "undefined" || value.length == 0}
        data={value}
        filename="custom.css"
    />
</div>