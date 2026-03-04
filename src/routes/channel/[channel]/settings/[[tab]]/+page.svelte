<script lang="ts">
    import { run } from 'svelte/legacy';

    import { goto, pushState } from "$app/navigation";
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
    import type { Channel } from "stoat.js";
    import type { ComponentType, SvelteComponent } from "svelte";
    import { t } from "svelte-i18n";
    import Info from "svelte-boxicons/BxInfoCircle.svelte";
    import List from "svelte-boxicons/BxListUl.svelte";
    import Permissions from "$lib/components/settings/channel/Permissions.svelte";
    import Scroller from "$lib/components/settings/common/scroller.svelte";
    import Row from "$lib/components/atoms/layout/Row.svelte";
    import CloseButton from "$lib/components/settings/common/CloseButton.svelte";

    const Pages: Record<
        string,
        ComponentType<SvelteComponent<{ channel: Channel }>>
    > = {
        overview: Overview,
        permissions: Permissions,
    };

    interface Props {
        data: any;
    }

    let { data }: Props = $props();
    let tab;
    run(() => {
        tab = data.tab;
    });
    let client = useClient();
    let channel = $derived(client.channels.get(data.channel));
    let isVertical = $state(state.layout.getViewport() == Viewport.SMALL);
    run(() => {
        autorun(() => {
            isVertical = state.layout.getViewport() == Viewport.SMALL;
        });
    });
    run(() => {
        if (!tab && !isVertical) {
            tab = "overview";
        }
    });

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

<svelte:body onkeydown={keyDown} />

{#if channel}
    {#if tab}
        <Row>
            {#if !isVertical}
                <Scroller>
                    <Category>{channel.name}</Category>
                    <Item onClick={()=>tab = "overview"} active={tab == "overview"}>
                        {#snippet svg()}
                                                <Info size={20}  />
                                            {/snippet}
                        {$t("app.settings.channel_pages.overview.title")}
                    </Item>
                    <Item onClick={()=>tab="permissions"} active={tab == "permissions"}>
                        {#snippet svg()}
                                                <List size={20}  />
                                            {/snippet}
                        {$t("app.settings.channel_pages.permissions.title")}
                    </Item>
                </Scroller>
            {/if}
            <ScrollerContent>
                <h1>
                    {$t(`app.settings.channel_pages.${tab}.title`, {
                        default: tab[0].toUpperCase().concat(tab.slice(1)),
                    })}
                </h1>
                {@const SvelteComponent_1 = Pages[tab]}
                <SvelteComponent_1 {channel} />
            </ScrollerContent>
            <CloseButton />
        </Row>
        
    {:else}
        <SettingsMenu>
            <Category>{channel.name}</Category>
            <Item href="settings/overview" large active>
                {#snippet svg()}
                                <Info size={20}  />
                            {/snippet}
                {$t("app.settings.channel_pages.overview.title")}
            </Item>
            <Item href="settings/permissions" large active>
                {#snippet svg()}
                                <List size={20}  />
                            {/snippet}
                {$t("app.settings.channel_pages.permissions.title")}
            </Item>
        </SettingsMenu>
    {/if}
{/if}
