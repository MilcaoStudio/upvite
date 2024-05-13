<script lang="ts">
    import { goto } from "$app/navigation";
    import { state } from "$lib/State";
    import { modalController } from "$lib/components/modals/ModalController.js";
    import Overview from "$lib/components/settings/channel/Overview.svelte";
    import SettingsMenu from "$lib/components/settings/common/SettingsMenu.svelte";
    import Category from "$lib/components/settings/common/category.svelte";
    import Item from "$lib/components/settings/common/buttonSimple.svelte";
    import ScrollerContent from "$lib/components/settings/common/scrollerContent.svelte";
    import { useClient } from "$lib/controllers/ClientController";
    import { Viewport } from "$lib/stores/Layout";
    import { autorun } from "mobx";
    import type { Channel } from "revolt.js";
    import type { ComponentType, SvelteComponent } from "svelte";
    import { t } from "svelte-i18n";
    import Info from "svelte-boxicons/BxInfoCircle.svelte";

    const Pages: Record<string, ComponentType<SvelteComponent<{channel: Channel}>>> = {
        overview: Overview,
    };

    
    export let data;
    $: tab = data.tab;
    $: channel = useClient().channels.get(data.channel);
    let isVertical = state.layout.getViewport() == Viewport.SMALL;
    $: autorun(() => {
        isVertical = state.layout.getViewport() == Viewport.SMALL;
    });
    if (!tab && !isVertical) {
        tab = "overview";
    }

    function exitSettings() {
        setTimeout(() => goto(state.layout.getLastPath()), 200);
    }

    function keyDown(ev: KeyboardEvent) {
        if (ev.key == "Escape") {
            if (modalController.isVisible) return;
            exitSettings();
        }
    }
</script>

<svelte:body on:keydown={keyDown} />

{#if channel}
    {#if tab}
        <ScrollerContent>
            <h1>
                {$t(`app.settings.channel_pages.${tab}.title`, {
                    default: tab[0].toUpperCase().concat(tab.slice(1)),
                })}
            </h1>
            <svelte:component this={Pages[tab]} {channel} />
        </ScrollerContent>
    {:else}
        <SettingsMenu>
            <Category>{channel.name}</Category>
            <Item href="settings/overview" large active>
                <Info size={20} slot="svg" />
                Overview
            </Item>
        </SettingsMenu>
    {/if}
{/if}
