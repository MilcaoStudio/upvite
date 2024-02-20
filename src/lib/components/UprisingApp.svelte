<script lang="ts">
    import { page, navigating } from "$app/stores";
    import { isTouchscreenDevice } from "$lib";
    import OverlapPanel, { Docked, ShowIf } from "./OverlapPanel.svelte";
    import TitleBar from "./TitleBar.svelte";
    import ChannelView from "./channels/ChannelView.svelte";
    import Home from "./home/Home.svelte";
    import LeftSidebar from "./navigation/LeftSidebar.svelte";
    import RightSidebar from "./navigation/RightSidebar.svelte";
    import BottomNavigation from "./navigation/BottomNavigation.svelte";

    // Make true on worker alert
    // let showStatusBar = false;
    let path: string, fixedBottomNav: boolean, inChannel: boolean, inServer: boolean, inSpecial: boolean;
    $: {
        path = $navigating?.to?.url.pathname || "";
        fixedBottomNav =
            path === "/" ||
            path === "/settings" ||
            path.startsWith("/friends") ||
            path.startsWith("/discover");
        inChannel = path.includes("/channel");
        inServer = path.includes("/server");
        inSpecial =
            (path.startsWith("/friends") && isTouchscreenDevice) ||
            path.startsWith("/invite") ||
            path.includes("/settings");
    }
</script>

<div class="app-container">
    {#if window.isNative && !window.native.getConfig().frame}
        <TitleBar />
    {/if}
    <OverlapPanel
        width="100vw"
        height={(/*alert && statusBar ? "calc(" : "") +
            (window.isNative && !window.native.getConfig().frame
                ? "calc(var(--app-height) - var(--titlebar-height))"
                :*/ "var(--app-height)") +
            (/*alert && statusBar ? " - 40px)" :*/ "")}
        leftPanel={inSpecial
            ? undefined
            : { width: 290, component: LeftSidebar }}
        rightPanel={!inSpecial && inChannel
            ? { width: 236, component: RightSidebar }
            : undefined}
        bottomNav={{
            component: BottomNavigation,
            showIf: fixedBottomNav ? ShowIf.Always : ShowIf.Left,
            height: 50,
        }}
        docked={isTouchscreenDevice ? Docked.None : Docked.Left}
    >
       <slot />
    </OverlapPanel>
</div>
