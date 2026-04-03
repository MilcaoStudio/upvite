<script>
    import { page } from "$app/state";
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import Home from "$lib/components/home/Home.svelte";
    import { useState } from "$lib/components/state/StateContext.svelte";
    import CheckAuth from "$lib/controllers/CheckAuth.svelte";

    let layout = useState().layout;
    $effect(() => {
        layout.setLastHomePath(page.url.pathname);
    });
</script>

<CheckAuth auth>
    <UprisingApp>
        <Home />
    </UprisingApp>
</CheckAuth>