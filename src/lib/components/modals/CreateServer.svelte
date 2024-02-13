<script lang="ts">
    import { useClient } from "$lib/controllers/ClientController";
    import type { ModalProps } from "$lib/types/Modal";
    import { _ } from "svelte-i18n";
    import ModalForm from "./ModalForm.svelte";
    import { pushState } from "$app/navigation";
    import { mapError } from "$lib";

    // export let props: ModalProps<"create_server"> = $props(); 
    export let props: ModalProps<"create_server">
    const client = useClient();

</script>

<ModalForm
    props={props}
    callback={async ({name})=>{
        const server = await client.servers.createServer({
            name: ''+name,
        }).catch(mapError);
        pushState(`/server/${server?._id}`, {})
    }}
    schema={{name: "text"}}
    data={{name: {field: $_('app.main.servers.name')}}}
    submit={{children: $_('app.special.modals.actions.create')}} >
    <svelte:fragment slot="title">{$_('app.main.servers.create')}</svelte:fragment>
    <div slot="description">
        By creating this server, you agree to the{" "}
        <a
            href="http://localhost"
            target="_blank"
            rel="noreferrer">
                Acceptable Use Policy.
        </a>
    </div>
</ModalForm>