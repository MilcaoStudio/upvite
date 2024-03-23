<script lang="ts">
    import { mapError } from "$lib";
    import { useClient } from "$lib/controllers/ClientController";
    import type { ModalProps } from "$lib/types/Modal";
    import { t } from "svelte-i18n";
    import DialogForm from "./DialogForm.svelte";

    export let props: ModalProps<"modify_account">;

    const schema = Object.freeze({
        current_password: "password",
    });
    const usernameSchema = Object.freeze({ username: "text", ...schema });
    const emailSchema = Object.freeze({ email: "text", ...schema });
    const passwordSchema = Object.freeze({
        new_password: "password",
        ...schema,
    });
    async function callback({
        username,
        email,
        new_password,
        current_password,
    }: {
        username: string;
        email: string;
        new_password: string;
        current_password: string;
    }) {
        switch (props.field) {
            case "email":
                if (!email) return;
                await props.client.api
                    .patch("/auth/account/change/email", {
                        current_password,
                        email,
                    })
                    .catch(mapError);
                props.onClose();
                break;
            case "password":
                await props.client.api
                    .patch("/auth/account/change/password", {
                        password: new_password,
                        current_password,
                    })
                    .catch(mapError);
                props.onClose();
                break;
            case "username":
                await props.client.api
                    .patch("/users/@me/username", {
                        username,
                        password: current_password,
                    })
                    .catch(mapError);
                props.onClose();
        }
    }
</script>

<DialogForm
    {...props}
    {callback}
    schema={props.field == "email"
        ? emailSchema
        : props.field == "password"
          ? passwordSchema
          : usernameSchema}
    data={{
        current_password: { field: $t("login.current_password") },
        email: { field: $t("login.email") },
        username: { field: $t("login.username") },
        new_password: { field: $t("login.new_password") },
    }}
    submit={{
        children:
            props.field == "email"
                ? $t("app.special.modals.actions.send_email")
                : $t("app.special.modals.actions.update"),
    }}
    title={$t(`app.special.modals.account.change.${props.field}`)}
>
    <div slot="description">
        {#if props.field == "username"}
            Changing your username may change your number tag. You can freely
            change the case of your username. Your number tag may change at most
            once a day.
        {/if}
    </div>
</DialogForm>
