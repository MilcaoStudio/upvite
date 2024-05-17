import { action, computed, makeAutoObservable } from "mobx";

import { Language, Languages } from "../../lang/Languages";
import type Persistent from "$lib/types/Persistent";
import type Syncable from "$lib/types/Syncable";
import type { Nullable } from "revolt.js";
import { building } from "$app/environment";


export interface Data {
    lang: Language;
}

/**
 * Detect the browser language or match given language.
 * @param lang Language to find
 * @returns Matched Language
 */
export function findLanguage(lang?: Nullable<string>): Language {
    lang = lang || typeof navigator == "undefined" ? Language.ENGLISH : navigator.language || "en";
    console.info("Finding", lang);

    const code = lang!.replace("-", "_");
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
 * Keeps track of user's language settings.
 */
export default class LocaleOptions
    implements Persistent<Data>, Syncable
{
    private lang: Language;

    /**
     * Construct new LocaleOptions store.
     */
    constructor() {
        if (building) {
            this.lang = Language.ENGLISH;
        } else {
            this.lang = findLanguage();
        }
        makeAutoObservable(this);
    }

    get id() {
        return "locale";
    }

    toJSON() {
        return {
            lang: this.lang,
        };
    }

    apply(_key: "locale", data: unknown, _revision: number): void {
        this.hydrate(data as Data);
    }

    @computed toSyncable(): { [key: string]: object } {
        return {
            locale: this.toJSON(),
        };
    }

    @action hydrate(data: Data) {
        this.setLanguage(data.lang);
    }

    /**
     * Get current language.
     */
    @computed getLanguage() {
        return this.lang;
    }

    /**
     * Set current language.
     */
    @action setLanguage(language: Language) {
        if (typeof Languages[language] == "undefined") return;
        this.lang = language;
    }
}