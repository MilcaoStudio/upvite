import { browser } from "$app/environment";
import { fail, type Actions } from "@sveltejs/kit";
export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
        //const client: Client = getContext('client');
        const email = data.get('email')?.toString();
        if(!email) return fail(400);
        const password = data.get('password')?.toString();
        if(!password) return fail(400);
        return { success: true };
	}
};