<script lang="ts">
  import { dictionary, locale, waitLocale } from "svelte-i18n";
  import { browser } from "$app/environment";
  import { setContext } from "svelte";
  import { Languages } from "external/lang/Languages";
  import { defaultDictionary, type Dictionary, transformLanguage, dayjs, defaultLocale } from "$lib/i18n";
  import { state } from "$lib/State";
  import { findLanguage } from "$lib/stores/LocaleOptions";
    import { autorun } from "mobx";

  let definitions: Dictionary = defaultDictionary;
  let lang = state.locale.getLanguage();
  let source = Languages[lang];

  if (browser) {
    lang = findLanguage($locale);
  }

  $: loadLanguage = async function (locale: string) {
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
  };

  $: autorun(()=>{
    locale.set(state.locale.getLanguage())
  })
  $: definitions && setContext('dictionary', definitions);
  $: document.body.style.direction = source.rtl ? "rtl" : "";
</script>

{#await loadLanguage($locale || defaultLocale) then }
  <slot />
{/await}

