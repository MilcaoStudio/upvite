<script>
    import { t } from "svelte-i18n";
    import DialogForm from "./DialogForm.svelte";
    import { useClient } from "$lib/controllers/ClientController";
    import { mapError } from "$lib";
    import { goto } from "$app/navigation";
    let client = useClient();
</script>

<DialogForm
    title={$t("app.main.groups.create")}
    schema={{ name: "text" }}
    data={{ name: { field: $t("app.main.groups.name") } }}
    callback={async ({ name }) => {
        const group = await client.channels
            .createGroup({
                name,
                users: [],
            })
            .catch(mapError);
        return goto(`/channel/` + group._id);
    }}
    submit={{ children: $t("app.special.modals.actions.create") }}
/>
