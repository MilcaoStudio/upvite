<script context="module" lang="ts">
  import dayJS from "dayjs"
  export const dayjs = dayJS;
  import calendar from "dayjs/plugin/calendar";
  import format from "dayjs/plugin/localizedFormat";
  import update from "dayjs/plugin/updateLocale";

  dayjs.extend(calendar);
  dayjs.extend(format);
  dayjs.extend(update);
</script>

<script>
    import { browser } from '$app/environment';
    import '$lib/i18n'
    import { locale, waitLocale } from 'svelte-i18n'
    if (browser) {
		locale.set(window.navigator.language);
	}
	waitLocale();
</script>

<slot />