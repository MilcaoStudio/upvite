// place files you want to import through the `$lib` alias in this folder.

import { browser } from "$app/environment";

export function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    const rawData = window.atob(base64);

    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
}

export function mapToRecord<K extends symbol | string | number, V>(
    map: Map<K, V>,
) {
    const record = {} as Record<K, V>;
    map.forEach((v, k) => (record[k] = v));
    return record
}

export function takeError(error: any): string {
    if (error.response) {
        const type = error.response.data?.type;
        if (type) {
            return type;
        }

        switch (error.response.status) {
            case 429:
                return "TooManyRequests";
            case 401:
            case 403:
                return "Unauthorized";
            default:
                return "UnknownError";
        }
    } else if (error.request) {
        return "NetworkError";
    }

    console.error(error);
    return "UnknownError";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapError(error: any): never {
    throw takeError(error);
}

export const isTouchscreenDevice = browser && navigator.maxTouchPoints > 1;


  export function injectWindow(key: string, source: any) {
    if (typeof window !== 'undefined') {
        // Solo ejecuta este código en el entorno del navegador
        if (!window.hasOwnProperty(key)) {
            Object.defineProperty(window, key, { value: source });
        }
    }
}

/*

export function injectWindow(key: string, source: any) {
    !Object.hasOwn(window, key) && Object.defineProperty(window, key, {value: source});
}

*/

/**
 * Schedule a task at the end of the Event Loop
 * @param cb Callback
 */
export const defer = (cb: () => void) => setTimeout(cb, 0);

/**
 * Schedule a task at the end of the second Event Loop
 * @param cb Callback
 */
export const chainedDefer = (cb: () => void) => defer(() => defer(cb));