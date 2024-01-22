import { browser } from '$app/environment'
import { init, register } from 'svelte-i18n'
import { read } from '$app/server';

const defaultLocale = 'en'

register('en', () => import('../../routes/lang/en.json'))
register('es', () => import('../../routes/lang/es.json'))

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale,
})