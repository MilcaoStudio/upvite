<script lang="ts">
  import { run } from 'svelte/legacy';

  import { dictionary, isLoading, locale, waitLocale } from "svelte-i18n";
  import { browser } from "$app/environment";
  import { setContext } from "svelte";
  import { Languages } from "../../../lang/Languages";
  import { defaultDictionary, type Dictionary, transformLanguage, dayjs, defaultLocale } from "$lib/i18n";
  import { state } from "$lib/State";
  import { findLanguage } from "$lib/stores/LocaleOptions";
  import { autorun } from "mobx";
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
    

  let definitions: Dictionary = $state(defaultDictionary);
  let lang = state.locale.getLanguage();
  let source = Languages[lang];

  if (browser) {
    lang = findLanguage($locale);
  }

  let loadLanguage = $derived(async function (locale: string) {
    await waitLocale(locale);
    if (locale == "en") {
      // If English, make sure to restore everything to defaults.
      // Use what we already have.
      const defn = transformLanguage(defaultDictionary);
      definitions = defn;
      dayjs.locale("en");
      dayjs.updateLocale("en", { calendar: defn.dayjs });
      return;
    }

    let dict = $dictionary[source.i18n];
    if (!dict) {
      console.warn("Load of", source.i18n, "locale failed");
      return;
    }
    // Transform the definitions data.
    const defn = transformLanguage(dict.default as Dictionary);
    // Determine and load dayjs locales.
    const target = source.dayjs ?? source.i18n;
    const dayjs_locale = await import(
      `../../../../node_modules/dayjs/esm/locale/${target}.js`
    );
    // Load dayjs locales.
    dayjs.locale(target, dayjs_locale.default);

    if (defn.dayjs) {
      // Override dayjs calendar locales with our own.
      dayjs.updateLocale(target, { calendar: defn.dayjs });
    }

    // Apply definition to app.
    definitions = defn;
  });

  run(() => {
    autorun(()=>{
      locale.set(state.locale.getLanguage())
    })
  });
  run(() => {
    definitions && setContext('dictionary', definitions);
  });
  let document.body.style.direction = $derived(source.rtl ? "rtl" : "");
</script>

{#await loadLanguage($locale || defaultLocale) then }
  {#if !$isLoading}
    {@render children?.()}
  {/if}
{/await}

