<script context="module" lang="ts">
  import dayJS from "dayjs";
  import calendar from "dayjs/plugin/calendar";
  import format from "dayjs/plugin/localizedFormat";
  import update from "dayjs/plugin/updateLocale";
  import definition from "../../lang/en.json";
  import { Language, Languages } from "$lib/lang/Languages";

  export const dayjs = dayJS;
  dayjs.extend(calendar);
  dayjs.extend(format);
  dayjs.extend(update);

  export interface Dictionary {
    dayjs?: {
      defaults?: {
        twelvehour?: string;
        separator?: string;
        date?: "traditional" | "simplified" | "ISO8601";
      };
      timeFormat?: string;
    };
    [key: string]:
      | Record<string, Omit<Dictionary, "dayjs">>
      | string
      | undefined;
  }

  function findLanguage(lang?: Nullable<string>): Language {
    if (!lang) {
      if (!navigator) {
        lang = Language.ENGLISH;
      } else {
        lang = navigator.language;
      }
    }
    const code = lang.replace("-", "_");
    const short = code.split("_")[0];

    const values = [];
    for (const key in Language) {
      const value = Language[key as keyof typeof Language];

      // Skip alternative/joke languages
      if (Languages[value].cat == "const") continue;
      if (Languages[value].cat == "alt") continue;

      values.push(value);
      if (value.startsWith(code)) {
        return value as Language;
      }
    }

    for (const value of values.reverse()) {
      if (value.startsWith(short)) {
        return value as Language;
      }
    }
    return Language.ENGLISH;
  }

  /**
   * Apply defaults and process dayjs entries for a langauge.
   * @param source Dictionary definition to transform
   * @returns Transformed dictionary definition
   */
  function transformLanguage(source: Dictionary) {
    // Fallback untranslated strings to English (UK)
    const obj = defaultsDeep(source, definition);

    // Take relevant objects out, dayjs and defaults
    // should exist given we just took defaults above.
    const { dayjs } = obj;
    const { defaults } = dayjs;

    // Determine whether we are using 12-hour clock.
    const twelvehour = defaults?.twelvehour
      ? defaults.twelvehour === "yes"
      : false;

    // Determine what date separator we are using.
    const separator: string = defaults?.date_separator ?? "/";

    // Determine what date format we are using.
    const date: "traditional" | "simplified" | "ISO8601" =
      defaults?.date_format ?? "traditional";

    // Available date formats.
    const DATE_FORMATS = {
      traditional: `DD${separator}MM${separator}YYYY`,
      simplified: `MM${separator}DD${separator}YYYY`,
      ISO8601: "YYYY-MM-DD",
    };

    // Replace data in dayjs object, make sure to provide fallbacks.
    dayjs["sameElse"] = DATE_FORMATS[date] ?? DATE_FORMATS.traditional;
    dayjs["timeFormat"] = twelvehour ? "hh:mm A" : "HH:mm";

    // Replace {{time}} format string in dayjs strings with the time format.
    Object.keys(dayjs)
      .filter((k) => typeof dayjs[k] === "string")
      .forEach(
        (k) => (dayjs[k] = dayjs[k].replace(/{{time}}/g, dayjs["timeFormat"])),
      );

    return obj;
  }
</script>

<script lang="ts">
  import "$lib/i18n";
  import { dictionary, locale, waitLocale } from "svelte-i18n";
  import type { Nullable } from "revolt.js";
  import { browser } from "$app/environment";
  import defaultsDeep from "lodash.defaultsdeep";
    import { setContext } from "svelte";

  let definitions: Dictionary = definition;
  let lang = Language.ENGLISH;
  if (browser) {
    lang = findLanguage($locale);
  }

  const source = Languages[lang];
  $: loadLanguage = async function (locale: string) {
    if (locale == "en") {
      // If English, make sure to restore everything to defaults.
      // Use what we already have.
      const defn = transformLanguage(definition as Dictionary);
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

  $: source && loadLanguage(lang);
  $: definitions && setContext('dictionary', definitions);
  $: document.body.style.direction = source.rtl ? "rtl" : "";

  waitLocale();
</script>

<slot />
