<script lang="ts">
    import { goto } from "$app/navigation";
    import { state } from "$lib/State";
    import Row from "$lib/components/atoms/layout/Row.svelte";
    import { modalController } from "$lib/components/modals/ModalController";
    import { Viewport } from "$lib/stores/Layout";
    import { autorun } from "mobx";
    import type { ComponentType } from "svelte";
    import ScrollerContent from "./scrollerContent.svelte";
    import { t } from "svelte-i18n";
    import CloseButton from "./CloseButton.svelte";
    import Scroller from "./scroller.svelte";
    import SettingsMenu from "./SettingsMenu.svelte";
    import Category from "./category.svelte";
    import BxInfoCircle from "svelte-boxicons/BxInfoCircle.svelte";
    import BxListUl from "svelte-boxicons/BxListUl.svelte";
    import Button from "./buttonSimple.svelte";

    const icons: Record<string, ComponentType> = {
        overview: BxInfoCircle,
        permissions: BxListUl,
    };
    export let pages: Record<string, ComponentType>,
        tab: string | undefined = undefined,
        title: string | null = null,
        locale = "pages";
    let isVertical = state.layout.getViewport() == Viewport.SMALL;
    $: autorun(() => {
        isVertical = state.layout.getViewport() == Viewport.SMALL;
    });
    $: if (!tab && !isVertical) {
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

{#if tab}
    <Row>
        {#if !isVertical}
            <Scroller>
                <Category>{title}</Category>
                {#each Object.keys(pages) as page (page)}
                    <Button onClick={() => (tab = page)} active={tab == page}>
                        <svelte:component
                            this={icons[page]}
                            size={20}
                            slot="svg"
                        />
                        {$t(`app.settings.${locale}.${page}.title`)}
                    </Button>
                {/each}
            </Scroller>
        {/if}
        <ScrollerContent>
            <h1>
                {$t(`app.settings.channel_pages.${tab}.title`, {
                    default: tab[0].toUpperCase().concat(tab.slice(1)),
                })}
            </h1>
            <svelte:component this={pages[tab]} {...$$restProps} />
        </ScrollerContent>
        <CloseButton />
    </Row>
{:else}
    <SettingsMenu>
        <Category>{title}</Category>
        {#each Object.keys(pages) as page (page)}
            <Button href="settings/{page}" large active>
                <svelte:component this={icons[page]} size={20} slot="svg" />
                {$t(`app.settings.${locale}.${page}.title`)}
            </Button>
        {/each}
    </SettingsMenu>
{/if}
