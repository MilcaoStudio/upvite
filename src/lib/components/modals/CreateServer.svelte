<script lang="ts">
    import { useClient } from "$lib/controllers/ClientController";
    import type { ModalProps } from "$lib/types/Modal";
    import { _ } from "svelte-i18n";
    import { goto, } from "$app/navigation";
    import { mapError } from "$lib";
    import DialogForm from "./DialogForm.svelte";

    // export let props: ModalProps<"create_server"> = $props(); 
    export let props: ModalProps<"create_server">
    const client = useClient();

</script>

<DialogForm {...props}
    callback={async ({name})=>{
        const {id} = await client.servers.createServer({
        name: ''+name,
        }).catch(mapError);
        goto(`/server/${id}`,);
    }}
    schema={{name: "text"}}
    data={{name: {field: $_('app.main.servers.name')}}}
    submit={{children: $_('app.special.modals.actions.create')}}
    title={$_('app.main.servers.create')} >
    <div slot="description">
        By creating this server, you agree to the{" "}
        <a
            href="http://localhost"
            target="_blank"
            rel="noreferrer">
                Acceptable Use Policy.
        </a>
    </div>
</DialogForm>