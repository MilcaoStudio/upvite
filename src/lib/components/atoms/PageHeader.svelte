<script lang="ts">
    import { run } from 'svelte/legacy';

    import { page } from "$app/stores";
    import { isTouchscreenDevice } from "$lib";
    import { state } from "$lib/State";
    import { SIDEBAR_CHANNELS, Viewport } from "$lib/stores/Layout";
    import { css, cx } from "@emotion/css";
    import Header from "./Header.svelte";
    import HamburgerAction from './HamburgerAction.svelte'
    import BxChevronLeft from "svelte-boxicons/BxChevronLeft.svelte";
    import BxChevronRight from "svelte-boxicons/BxChevronRight.svelte";

    import type { ComponentType } from "svelte";
    import { autorun } from "mobx";
    interface Props {
        withBackground?: boolean;
        withTransparency?: boolean;
        noBurger?: boolean;
        icon: ComponentType;
        children?: import('svelte').Snippet;
    }

    let {
        withBackground = false,
        withTransparency = false,
        noBurger = false,
        icon,
        children
    }: Props = $props();
    const IconContainer = cx('IconContainer', css`
    display: flex;
    align-items: center;
    cursor: pointer;
    color: var(--secondary-foreground);
    margin-right: 5px;

    > svg {
        margin-right: -5px;
    }

    `);
    const layout = state.layout;
    let visible: boolean = $state();
    let isVertical = layout.getViewport() == Viewport.SMALL;
    run(() => {
        autorun(()=>{
            visible = layout.getSectionState(SIDEBAR_CHANNELS, true);
        });
    });
    let pathname = $derived($page.url.pathname);
    function toggleState(){
        layout.toggleSectionState(SIDEBAR_CHANNELS, visible)
    }
</script>

<Header withBackground={withBackground} withTransparency={withTransparency} palette='primary' topBorder={!visible} bottomBorder={!pathname.includes("/server")}>
    {#if !noBurger}
        <HamburgerAction />
    {/if}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    {@const SvelteComponent = icon}
    <div class={IconContainer} onclick={toggleState} onkeydown={toggleState}>
        {#if !isVertical && visible}
            <BxChevronLeft width="18" />
        {/if}
        <SvelteComponent width="24px" />
        {#if !isVertical && !visible}
            <BxChevronRight width="18" />
        {/if}
    </div>
    {@render children?.()}
</Header>