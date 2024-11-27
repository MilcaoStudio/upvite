<script lang="ts">
    import { t } from "svelte-i18n";
</script>

<h3>{$t("app.settings.server_pages.emojis.upload")}</h3>
<!-- FIXME: Scheme types are unstable. Should be fixed in svelte 5 migration. -->
<!--
<Form
    schema={{ name: "text", file: "file" }}
    data={{
        name: {
            field: "Name",
            palette: "secondary",
        },
        file: {
            behavior: {
                type: "upload",
                previewAfterUpload: true,
                onUpload: async (uploadId) => (id = uploadId),
            },
            fileType: "emojis",
            maxFileSize: 500_000,
            remove: async () => (id = ""),
            style: {
                type: "icon",
                width: 100,
                height: 100,
            },
        },
    }}
    onSubmit={async ({ name }) => {
        if (!/^[a-z0-9_]+$/.test(String(name))) {
            throw new Error("Invalid emoji name");
        }
        await server.client.api.put(`/custom/emoji/${id}`, {
            name: String(name),
            parent: { type: "Server", id: server._id },
        });
        id = "";
    }}
>
    <Row gap="8px" slot="field">
        <FormElement id="file" />
        <Column>
            <FormElement id="name" />
            <Button type="submit" palette="secondary" disabled={!id}>
                {$t("app.special.modals.actions.save")}
            </Button>
        </Column>
    </Row>
</Form>
-->