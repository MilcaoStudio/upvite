<script lang="ts">
    import { isTouchscreenDevice } from "$lib";
    import OverlapPanel, { Docked, ShowIf } from "./OverlapPanel.svelte";
    import TitleBar from "./TitleBar.svelte";
    import LeftSidebar from "./navigation/LeftSidebar.svelte";
    import RightSidebar from "./navigation/RightSidebar.svelte";
    import BottomNavigation from "./navigation/BottomNavigation.svelte";
    import { Viewport } from "$lib/components/state/stores/Layout";
    import type { Snippet } from 'svelte';
    import { page } from "$app/state";
    import { useState } from "./state/StateContext.svelte";

    interface Props {
        children?: Snippet;
    }

    let { children }: Props = $props();

    // Make true on worker alert
    // let showStatusBar = false;
    let layout = useState().layout;
    let path = page.url.pathname;
    let fixedBottomNav = $derived(path == "/" ||
            path.startsWith("/settings") ||
            path.startsWith("/friends") ||
            path.startsWith("/discover"));
    let inChannel = $derived(path.includes("/channel"));
    //let inServer = $derived(path.includes("/server"));
    let isTouch = isTouchscreenDevice();
    let inSpecial: boolean = $derived((path.startsWith("/friends") && isTouch) ||
            path.startsWith("/invite") || path.startsWith("/settings"));
    let isVertical = layout.getViewport() == Viewport.SMALL;
</script>

<div class="app-container">
    {#if window.isNative && !window.native.getConfig().frame}
        <TitleBar />
    {/if}
    <OverlapPanel
        width="100vw"
        height={(/*alert && statusBar ? "calc(" : "") + 
            (*/window.isNative && !window.native.getConfig().frame
                ? "calc(var(--app-height) - var(--titlebar-height))"
                : "var(--app-height)") +
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
        docked={isVertical ? Docked.None: Docked.Both}
    >
        {@render children?.()}
    </OverlapPanel>
</div>
