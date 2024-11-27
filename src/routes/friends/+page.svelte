<script>
    import { state } from "$lib/State";
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import Friends from "$lib/components/social/Friends.svelte";
    import CheckAuth from "$lib/controllers/CheckAuth.svelte";
    import { SIDEBAR_CHANNELS, Viewport } from "$lib/stores/Layout";
    import { autorun } from "mobx";

    let open = state.layout.getSectionState(
        SIDEBAR_CHANNELS,
        state.layout.getViewport() != Viewport.SMALL,
    );
    $: autorun(() => {
        open = state.layout.getSectionState(
            SIDEBAR_CHANNELS,
            state.layout.getViewport() != Viewport.SMALL,
        );
    });
</script>

<CheckAuth auth>
    <UprisingApp>
        <Friends />
    </UprisingApp>
</CheckAuth>
