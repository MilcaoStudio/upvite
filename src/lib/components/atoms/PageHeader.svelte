<script lang="ts">
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
    export let withBackground = false, withTransparency = false, noBurger = false, icon: ComponentType;
    const IconContainer = cx('IconContainer', css`
    display: flex;
    align-items: center;
    cursor: pointer;
    color: var(--secondary-foreground);
    margin-right: 5px;

    > svg {
        margin-right: -5px;
    }

    ${!isTouchscreenDevice &&
    css`
        &:hover {
            color: var(--foreground);
        }
    `}`);
    const layout = state.layout;
    let visible: boolean;
    let isVertical = layout.getViewport() == Viewport.SMALL;
    $: autorun(()=>{
        visible = layout.getSectionState(SIDEBAR_CHANNELS, true);
    });
    $: pathname = $page.url.pathname;
    function toggleState(){
        layout.toggleSectionState(SIDEBAR_CHANNELS, visible)
    }
</script>

<Header withBackground={withBackground} withTransparency={withTransparency} palette='primary' topBorder={!visible} bottomBorder={!pathname.includes("/server")}>
    {#if !noBurger}
        <HamburgerAction />
    {/if}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class={IconContainer} on:click={toggleState} on:keydown={toggleState}>
        {#if !isVertical && visible}
            <BxChevronLeft width="18" />
        {/if}
        <svelte:component this={icon} width="24px" />
        {#if !isVertical && !visible}
            <BxChevronRight width="18" />
        {/if}
    </div>
    <slot />
</Header>