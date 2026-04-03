<script lang="ts">
    import { SIDEBAR_CHANNELS, Viewport } from "$lib/components/state/stores/Layout";
    import { css, cx } from "@emotion/css";
    import Header from "./Header.svelte";
    import HamburgerAction from './HamburgerAction.svelte'
    import BxChevronLeft from "svelte-boxicons/BxChevronLeft.svelte";
    import BxChevronRight from "svelte-boxicons/BxChevronRight.svelte";
    import { useState } from "../state/StateContext.svelte";
    import { page } from "$app/state";
    interface Props {
        withBackground?: boolean;
        withTransparency?: boolean;
        noBurger?: boolean;
        icon: ConstructorOfATypedSvelteComponent;
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
    const layout = useState().layout;
    let visible = $derived(layout.isSectionOpen(SIDEBAR_CHANNELS) ?? true);
    let isVertical = layout.getViewport() == Viewport.SMALL;
    let pathname = $derived(page.url.pathname);
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