import { browser } from '$app/environment'
import { init, json, register, unwrapFunctionStore } from 'svelte-i18n'


const defaultLocale = 'en'

register('en', () => import('../../routes/lang/en.json'))
register('es', () => import('../../routes/lang/es.json'))

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale,
})

function recursiveReplaceFields(input: string, _fields: Record<string, string|number>): string[] {
	const key = Object.keys(_fields)[0];
	if (key) {
		const { [key]: field, ...restOfFields } = _fields;
		if (!field) return [input];
		const values = input.split(`{{${key}}}`).map(v=>recursiveReplaceFields(v, restOfFields)).flat();

		for (let i = values.length - 1; i > 0; i -= 2) {
			values.splice(i, 0, ''+field);
		}
		return values
	}
	return [input]
}
export function translate(id: string, fields: Record<string, string|number>) {
	const $json = unwrapFunctionStore(json);
	const value = $json(id);
	if (typeof value != "string") {
		return ''
	}
	return recursiveReplaceFields(value, fields).join(' ');
}