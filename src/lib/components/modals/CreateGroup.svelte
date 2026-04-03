<script>
    import { t } from "svelte-i18n";
    import DialogForm from "./DialogForm.svelte";
    import { mapError } from "$lib";
    import { goto } from "$app/navigation";
    import { useClient } from "../client/ClientContext.svelte";
    let client = useClient();
</script>

{#snippet createText()}{$t("app.special.modals.actions.create")}{/snippet}
<DialogForm
    title={$t("app.main.groups.create")}
    schema={{ name: "text" }}
    data={{ name: { field: $t("app.main.groups.name") } }}
    callback={async ({ name }) => {
        // TODO: Friend (user) picker
        const group = await client.channels
            .createGroup(name, [],)
            .catch(mapError);
        return goto(`/channel/` + group.id);
    }}
    submit={{
        children: createText,
    }}
/>
