import { useClient } from '$lib/controllers/ClientController.js';

export async function load({url}) {
    const withInvite = url.searchParams.get("invite");
    const invite = withInvite ? await useClient().fetchInvite(withInvite) : undefined;
    return {
        invite,
    }
}