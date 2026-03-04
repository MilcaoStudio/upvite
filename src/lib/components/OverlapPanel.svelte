<script module lang="ts">
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
    import { run } from 'svelte/legacy';

    type Panel = {
        width?: number;
        height?: number;
        showIf?: ShowIf;
        component: ConstructorOfATypedSvelteComponent;
    };
    interface Props {
        width: string;
        height: string;
        docked: Docked;
        leftPanel?: Panel | undefined;
        rightPanel?: Panel | undefined;
        bottomNav?: Panel | undefined;
        children?: import('svelte').Snippet;
        left?: import('svelte').Snippet;
        right?: import('svelte').Snippet;
    }

    let {
        width,
        height = $bindable(),
        docked,
        leftPanel = undefined,
        rightPanel = undefined,
        bottomNav = undefined,
        children,
        left,
        right
    }: Props = $props();
    let gridTemplateColumns =
        $derived((leftPanel ? (leftPanel.width || 0) + "px" : "") +
        ` ${width} ` +
        (rightPanel ? (rightPanel.width || 0) + "px" : ""));
    // $effect
    let scrollRef: HTMLDivElement = $state(), bottomNavRef: HTMLDivElement = $derived(function () {
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
    });

    
    run(() => {
        scrollRef,
            leftPanel,
            rightPanel,
            !bottomNav ? undefined : bottomNav.showIf;
        recalculate();
    });
    run(() => {
        if (!docked) {
            height = `calc(${height} - ${bottomNav?.height}px)`;
        }
    });
</script>

{#if docked}
    <div class="docked" style:width style:height>
        {#if docked & 1}
            {@const SvelteComponent = leftPanel?.component}
            <SvelteComponent />
        {/if}
        <div class="main">
            {@render children?.()}
        </div>
        {#if docked & 2}
            {@const SvelteComponent_1 = rightPanel?.component}
            <SvelteComponent_1 />
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
            onscroll={recalculate}
        >
            {#if leftPanel}
                <leftPanel.component
                    style={`height: ${height};`}
                    snap
                >
                    {@render left?.()}
                </leftPanel.component>
            {/if}
            {@render children?.()}
            {#if rightPanel}
                <rightPanel.component
                    style={`height: ${height};`}
                    snap
                >
                    {@render right?.()}
                </rightPanel.component>
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
