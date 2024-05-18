<script>
    import Settings from "$lib/components/settings/common/Settings.svelte";
    import Roles from "$lib/components/settings/server/Roles.svelte";
    import { useClient } from "$lib/controllers/ClientController";

    export let data;
    let client = useClient();
    $: tab = data.tab;
    $: server = client.servers.get(data.server);

    let pages = {
        roles: Roles,
    };
</script>

<Settings {tab} locale="server_pages" title={server?.name} {pages} {server}
/>
