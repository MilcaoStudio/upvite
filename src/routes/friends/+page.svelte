<script>
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import Friends from "$lib/components/social/Friends.svelte";
    import CheckAuth from "$lib/controllers/CheckAuth.svelte";
    import { SIDEBAR_CHANNELS, Viewport } from "$lib/components/state/stores/Layout";
    import { useState } from "$lib/components/state/StateContext.svelte";

    const layout = useState().layout;
    let open = $derived(layout.isSectionOpen(SIDEBAR_CHANNELS,) || layout.getViewport() != Viewport.SMALL,);
</script>

<CheckAuth auth>
    <UprisingApp>
        <Friends />
    </UprisingApp>
</CheckAuth>
