import { browser } from '$app/environment'
import { init, json, register, unwrapFunctionStore } from 'svelte-i18n'

import dayJS from "dayjs";
import calendar from "dayjs/plugin/calendar";
import format from "dayjs/plugin/localizedFormat";
import update from "dayjs/plugin/updateLocale";
import definition from "external/lang/en.json";
import { Language, Languages } from "external/lang/Languages";
import defaultsDeep from 'lodash.defaultsdeep';

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

export const defaultDictionary = definition;
export const defaultLocale = Language.ENGLISH;

/**
 * Apply defaults and process dayjs entries for a langauge.
 * @param source Dictionary definition to transform
 * @returns Transformed dictionary definition
 */
export function transformLanguage(source: Dictionary) {
  // Fallback untranslated strings to English (UK)
  const obj = defaultsDeep(source, definition);

  // Take relevant objects out, dayjs and defaults
  // should exist given we just took defaults above.
  const { dayjs } = obj;
  const { defaults } = dayjs;

  // Determine whether we are using 12-hour clock.
  const twelvehour = defaults?.twelvehour
	? defaults.twelvehour == "yes"
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

for (const language in Languages) {
	try {
		register(language, () => /* @vite-ignore dynamic import */ import(`/external/lang/${language}.json`));
	} catch (err) {
		console.error("Error registering", language, err);
	}
}

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale,
});

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