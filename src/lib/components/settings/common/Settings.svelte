<script lang="ts">
    import { goto } from "$app/navigation";
    import Row from "$lib/components/atoms/layout/Row.svelte";
    import { modalController } from "$lib/components/modals/ModalController";
    import { Viewport } from "$lib/components/state/stores/Layout";
    import type { Component } from "svelte";
    import ScrollerContent from "./scrollerContent.svelte";
    import { t } from "svelte-i18n";
    import CloseButton from "./CloseButton.svelte";
    import Scroller from "./scroller.svelte";
    import SettingsMenu from "./SettingsMenu.svelte";
    import Category from "./category.svelte";
    import BxInfoCircle from "svelte-boxicons/BxInfoCircle.svelte";
    import BxListUl from "svelte-boxicons/BxListUl.svelte";
    import BxCrown from "svelte-boxicons/BxCrown.svelte";
    import Button from "./buttonSimple.svelte";
    import BxHappyBeaming from "svelte-boxicons/BxHappyBeaming.svelte";
    import { useState } from '$lib/components/state/StateContext.svelte';

    const icons: Record<string, ConstructorOfATypedSvelteComponent> = {
        overview: BxInfoCircle,
        permissions: BxListUl,
        roles: BxCrown,
        emojis: BxHappyBeaming,
    };
    interface Props {
        pages: Record<string, Component<any>>;
        tab?: string | undefined;
        title?: string | null;
        locale?: string;
        [key: string]: any
    }

    let {
        pages,
        tab,
        title = null,
        locale = "pages",
        ...rest
    }: Props = $props();
    const layout = useState().layout;
    let isVertical = $derived(layout.getViewport() == Viewport.SMALL);
    $effect(() => {
        if (!tab && !isVertical) {
            tab = "overview";
        }
    });

    function exitSettings() {
        setTimeout(() => goto(layout.getLastPath()), 200);
    }

    function keyDown(ev: KeyboardEvent) {
        if (ev.key == "Escape") {
            if (modalController.isVisible) return;
            exitSettings();
        }
    }
</script>

<svelte:body onkeydown={keyDown} />

{#if tab}
    <Row>
        {#if !isVertical}
            <Scroller>
                <Category>{title}</Category>
                {#each Object.keys(pages) as page (page)}
                    <Button onClick={() => (tab = page)} active={tab == page}>
                        {#snippet svg()}
                            {@const SvelteComponent = icons[page]}
                            <SvelteComponent size={20} />
                        {/snippet}
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
            {@const SvelteComponent_1 = pages[tab]}
            <SvelteComponent_1 {...rest} />
        </ScrollerContent>
        <CloseButton />
    </Row>
{:else}
    <SettingsMenu>
        <Category>{title}</Category>
        {#each Object.keys(pages) as page (page)}
            <Button href="settings/{page}" large active>
                {#snippet svg()}
                    {@const SvelteComponent_2 = icons[page]}
                    <SvelteComponent_2 size={20}  />
                {/snippet}
                {$t(`app.settings.${locale}.${page}.title`)}
            </Button>
        {/each}
    </SettingsMenu>
{/if}
