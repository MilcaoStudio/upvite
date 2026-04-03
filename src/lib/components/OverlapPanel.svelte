<script module lang="ts">
    export const Docked = Object.freeze({
        None: 0,
        Left: 1,
        Right: 2,
        Both: 3,
    });
    export const ShowIf = Object.freeze({
        Left: 1,
        Right: 2,
        Both: 3,
        Always: 4,
    });
</script>

<script lang="ts">
    import type { Component, Snippet } from "svelte";

    type Panel = {
        width?: number;
        height?: number;
        showIf?: number;
        component: Component;
    };
    interface Props {
        width: string;
        height: string;
        docked: number;
        leftPanel?: Panel | undefined;
        rightPanel?: Panel | undefined;
        bottomNav?: Panel | undefined;
        children?: Snippet;
    }

    let {
        width,
        height = $bindable(),
        docked,
        leftPanel = undefined,
        rightPanel = undefined,
        bottomNav = undefined,
        children,
    }: Props = $props();
    let gridTemplateColumns =
        $derived((leftPanel ? (leftPanel.width || 0) + "px" : "") +
        ` ${width} ` +
        (rightPanel ? (rightPanel.width || 0) + "px" : ""));
    
    let scrollRef: HTMLDivElement | undefined = $state(), bottomNavRef: HTMLDivElement | undefined = $state();

    $effect(() => {
        const el = scrollRef;
        const bEl = bottomNavRef;
        if (!el || !bEl || !bottomNav?.height) return;
        const showIf =
            typeof bottomNav.showIf == "undefined"
                ? ShowIf.Both
                : bottomNav.showIf;
        console.log("ShowIf", showIf);
        if (showIf & ShowIf.Always) {
            bEl.style.top = "";
            return;
        }
        const lWidth = leftPanel?.width || 0;
        const rWidth = rightPanel?.width || 0;
        const hidden = bottomNav.height + "px";
        if (el.scrollLeft < lWidth) {
            if (showIf & ShowIf.Left) {
                bEl.style.top =
                    (el.scrollLeft / lWidth) * bottomNav.height + "px";
                return;
            } else if (bEl.style.top == hidden) {
                return;
            }
        }

        if (el.scrollLeft > lWidth) {
            if (showIf & ShowIf.Right) {
                bEl.style.top =
                    ((el.scrollLeft - lWidth) / rWidth) * -bottomNav.height +
                    bottomNav.height +
                    "px";

                return;
            } else if (bEl.style.top == hidden) {
                return;
            }
        }

        bEl.style.top = hidden;
    });

    $effect(() => {
        if (!docked) {
            height = `calc(${height} - ${(bottomNav?.height) || 0}px)`;
        }
    });
</script>

{#if docked}
    <div class="docked" style:width style:height>
        {#if docked & 1}
            {@const LeftPanel = leftPanel?.component}
            <LeftPanel />
        {/if}
        <div class="main">
            {@render children?.()}
        </div>
        {#if docked & 2}
            {@const RightPanel = rightPanel?.component}
            <RightPanel />
        {/if}
    </div>
{:else}
    <div class="container">
        <div
            class="snap"
            style:width
            style:height
            style:grid-template-columns={gridTemplateColumns}
            bind:this={scrollRef}
        >
            {#if leftPanel}
                <leftPanel.component
                    style={`height: ${height};`}
                    snap
                />
            {/if}
            {@render children?.()}
            {#if rightPanel}
                <rightPanel.component
                    style={`height: ${height};`}
                    snap
                />
            {/if}
        </div>
        {#if bottomNav}
            <div class="nav" style:height="{bottomNav.height}px">
                <div bind:this={bottomNavRef} style:width>
                    <bottomNav.component />
                </div>
            </div>
        {/if}
    </div>
{/if}
