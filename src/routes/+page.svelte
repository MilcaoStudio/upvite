<script>
    import { page } from "$app/stores";
    import { isTouchscreenDevice } from "$lib";
    import { state } from "$lib/State";
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import Home from "$lib/components/home/Home.svelte";
    import SidebarBase from "$lib/components/navigation/SidebarBase.svelte";
    import HomeSidebar from "$lib/components/navigation/left/HomeSidebar.svelte";
    import ServerListSidebar from "$lib/components/navigation/left/ServerListSidebar.svelte";
    import CheckAuth from "$lib/controllers/CheckAuth.svelte";
    import { SIDEBAR_CHANNELS } from "$lib/stores/Layout";

    let open = isTouchscreenDevice || state.layout.getSectionState(SIDEBAR_CHANNELS, true);
    $: state.layout.setLastHomePath($page.url.pathname);
</script>

<CheckAuth auth>
    <UprisingApp>
    <!--/settings/:page route -->
        <!--/settings route -->
        <!--/discover route -->
        <!--/dev route -->
        <!--/friends route -->
        <!--/open/:id route -->
        <!--/bot/:id route -->
        <SidebarBase slot="left">
                <ServerListSidebar />
                {#if open}
                    <HomeSidebar />
                {/if}
        </SidebarBase>
        <Home />
    </UprisingApp>
</CheckAuth>