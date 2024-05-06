<script context="module" lang="ts">
    export enum Docked {
        None,
        Left,
        Right,
        Both,
    }
    export enum ShowIf {
        Left = 1,
        Right = 2,
        Both = 3,
        Always = 4,
    }
</script>

<script lang="ts">
    type Panel = {
        width?: number;
        height?: number;
        showIf?: ShowIf;
        component: ConstructorOfATypedSvelteComponent;
    };
    export let width: string,
        height: string,
        docked: Docked,
        leftPanel: Panel | undefined = undefined,
        rightPanel: Panel | undefined = undefined,
        bottomNav: Panel | undefined = undefined;
    $: gridTemplateColumns =
        (leftPanel ? (leftPanel.width || 0) + "px" : "") +
        ` ${width} ` +
        (rightPanel ? (rightPanel.width || 0) + "px" : "");
    // $effect
    let scrollRef: HTMLDivElement, bottomNavRef: HTMLDivElement;

    $: recalculate = function () {
        const el = scrollRef;
        const bEl = bottomNavRef;
        if (!bEl || !bottomNav || !bottomNav.height) return;
        const showIf =
            typeof bottomNav?.showIf == "undefined"
                ? ShowIf.Both
                : bottomNav.showIf;
        console.log("ShowIf", showIf);
        if (showIf & ShowIf.Always) {
            bEl.style.top = "";
            return;
        }
        const lWidth =
            (!leftPanel || leftPanel === undefined
                ? undefined
                : leftPanel.width) || 0;
        const rWidth =
            (!rightPanel || rightPanel === undefined
                ? undefined
                : rightPanel.width) || 0;
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
    };
    $: {
        scrollRef,
            leftPanel,
            rightPanel,
            !bottomNav ? undefined : bottomNav.showIf;
        recalculate();
    }
</script>

{#if docked}
    <div class="docked" style:width style:height>
        {#if docked & 1}
            <svelte:component this={leftPanel?.component} />
        {/if}
        <div class="main">
            <slot />
        </div>
        {#if docked & 2}
            <svelte:component this={rightPanel?.component} />
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
            on:scroll={recalculate}
        >
            {#if leftPanel}
                <svelte:component
                    this={leftPanel.component}
                    style={`height: ${height};`}
                    snap
                >
                    <slot name="left" />
                </svelte:component>
            {/if}
            <slot />
            {#if rightPanel}
                <svelte:component
                    this={rightPanel.component}
                    style={`height: ${height};`}
                    snap
                >
                    <slot name="right" />
                </svelte:component>
            {/if}
        </div>
        {#if bottomNav}
            <div class="nav" style:bottom={height}>
                <div bind:this={bottomNavRef} style:height={height} style:width>
                    <svelte:component this={bottomNav.component} />
                </div>
            </div>
        {/if}
    </div>
{/if}
