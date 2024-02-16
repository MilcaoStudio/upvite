import { page } from "$app/stores";
import { get } from "svelte/store";

export const routeInformation = {
    getServer: () =>
        /server\/([0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26})/.exec(
            get(page).url.pathname,
        )?.[1],
    getChannel: () =>
        /channel\/([0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26})/.exec(
            get(page).url.pathname,
        )?.[1],
};
