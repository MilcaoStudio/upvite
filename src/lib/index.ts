// place files you want to import through the `$lib` alias in this folder.

import State from "./State";

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

/**
 * Inject a key into the window's globals.
 * @param key Key
 * @param value Value
 */
export function injectWindow(key: string, value: any) {
    (window as any)[key] = value;
}

/**
 * Inject a controller into the global controllers object.
 * @param key Key
 * @param value Value
 */
export function injectController(key: string, value: any) {
    (globalThis as any).controllers = {
        ...((globalThis as any).controllers ?? {}),
        [key]: value,
    };
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