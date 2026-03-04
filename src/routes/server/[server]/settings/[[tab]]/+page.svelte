<script>
    import Settings from "$lib/components/settings/common/Settings.svelte";
    import Emojis from "$lib/components/settings/server/Emojis.svelte";
    import Overview from "$lib/components/settings/server/Overview.svelte";
    import Roles from "$lib/components/settings/server/Roles.svelte";
    import { useClient } from "$lib/controllers/ClientController";

    /** @type {{data: any}} */
    let { data } = $props();
    let client = useClient();
    let tab = $derived(data.tab);
    let server = $derived(client.servers.get(data.server));

    let pages = {
        overview: Overview,
        roles: Roles,
        emojis: Emojis,
    };
</script>

<Settings {tab} locale="server_pages" title={server?.name} {pages} {server}
/>
