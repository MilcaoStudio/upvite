<script>
    import { goto } from "$app/navigation";
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import Home from "$lib/components/home/Home.svelte";
    import { createMockClient, servers, useClient } from "$lib/components/mock/MockClient";
    createMockClient();
    goto(`/demo/${servers[0].channel_ids[0]}`)
</script>

<UprisingApp>
    <Home />
</UprisingApp>