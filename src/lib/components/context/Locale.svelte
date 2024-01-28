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