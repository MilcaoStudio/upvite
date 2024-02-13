<script lang="ts">
    import { page, navigating } from "$app/stores";
    import { isTouchscreenDevice } from "$lib";
    import ChannelView from "./channels/ChannelView.svelte";
    import Home from "./home/Home.svelte";

    // Make true on worker alert
    // let showStatusBar = false;
    let path: string;
    $: {
        path = $navigating?.to?.url.pathname || '';
        const fixedBottomNav =
        path === "/" ||
        path === "/settings" ||
        path.startsWith("/friends") ||
        path.startsWith("/discover");
        const inChannel = path.includes("/channel");
        const inServer = path.includes("/server");
        const inSpecial =
        (path.startsWith("/friends") && isTouchscreenDevice) ||
        path.startsWith("/invite") ||
        path.includes("/settings");
    }
    
</script>

<div class="app-container">
    <!-- TODO: more routes -->
{#if /server\/.+(\/)?$/.test(path)}
    <ChannelView />
{:else}
    <Home />
{/if}
</div>