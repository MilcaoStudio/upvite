import { browser } from "$app/environment";
import { clientController } from "$lib/controllers/ClientController";
import { fail, type Actions } from "@sveltejs/kit";
export const actions: Actions = {
	register: async (event) => {
		const data = await event.request.formData();
        //const client: Client = getContext('client');
        const email = data.get('email')?.toString();
        if(!email) return fail(400);
        const password = data.get('password')?.toString();
        if(!password) return fail(400);
        if (browser) {
            console.log(email);
            console.log(password);
            clientController.getAnonymousClient().register({email, password})
            .then(session => {console.log(session);})
            .catch(err => console.error(err));
        }
        return { success: true };
	}
};