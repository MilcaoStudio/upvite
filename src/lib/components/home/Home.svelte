<script lang="ts">
    import { BxHome, BxPlusCircle, BxCompass, BxRightArrowCircle, BxGroup } from 'svelte-boxicons'
    import { css, cx } from "@emotion/css";
    import { useClient } from "$lib/controllers/ClientController";
    import { isTouchscreenDevice } from "$lib";
    import { _ } from "svelte-i18n";
    import PageHeader from "../atoms/PageHeader.svelte";
    import CategoryButton from "../form/CategoryButton.svelte";

    const Overlay = cx(
        "Overlay",
        css`
            display: grid;
            height: 100%;

            > * {
                grid-area: 1 / 1;
            }

            .content {
                z-index: 1;
            }
        `,
    );
    const client = useClient();
    // const seasonalTheme = state.settings.get("appearance:seasonal", true);
    let seasonalTheme = true;
    // const toggleSeasonalTheme = () => state.settings.set("appearance:seasonal", !seasonalTheme);
    const toggleSeasonalTheme = ()=>seasonalTheme = !seasonalTheme;
    const isDecember = !isTouchscreenDevice && new Date().getMonth() == 11;
    const isOctober = !isTouchscreenDevice && new Date().getMonth() == 9;

    $: snowflakes = (function () {
        const flakes: string[] = [];

        if (isDecember) {
            for (let i = 0; i < 15; i++) {
                flakes.push("❄️");
                flakes.push("❄");
            }

            for (let i = 0; i < 2; i++) {
                flakes.push("🎄");
                flakes.push("☃️");
                flakes.push("⛄");
            }

            return flakes;
        }
        if (isOctober) {
            for (let i = 0; i < 15; i++) {
                flakes.push("🎃");
                flakes.push("💀");
            }

            for (let i = 0; i < 2; i++) {
                flakes.push("👻");
                flakes.push("⚰️");
                flakes.push("🕷️");
            }

            return flakes;
        }
        return flakes;
    })();
</script>

<!--TODO-->
<div class="home">
    <div class={Overlay}>
        {#if seasonalTheme}
        <div class="snowfall">
            {#each snowflakes as emoji}
                <div class="snowflake">
                    {emoji}
                </div>
            {/each}
        </div>
        {/if}
        <div class="content">
            <PageHeader icon={BxHome} withTransparency>
                {$_('app.navigation.tabs.home')}
            </PageHeader>
        </div>
        <div class="homeScreen">
            <h3>{$_('app.special.modals.onboarding.welcome')} Uprising</h3>
            <div class="actions">
                <!-- svelte-ignore a11y-missing-attribute -->
                <!--on:click={()=>modalController.push({type: "create_group",})}-->
                <a role="menuitem" tabindex="0" on:click={()=>{}} on:keydown={()=>{}}>
                    <CategoryButton action="chevron" icon={BxPlusCircle} description={$_('app.home.group_desc')}>
                        {$_('app.home.group')}
                    </CategoryButton>
                </a>
                <a href="/discover">
                    <CategoryButton action="chevron" icon={BxCompass} description={$_('app.home.discover_desc')}>{$_('app.home.discover')}</CategoryButton>
                </a>
                {#if client.servers.get(
                    "01F7ZSBSFHQ8TA81725KQCSDDP",
                ) }
                    <a href="/server/01F7ZSBSFHQ8TA81725KQCSDDP">
                        <CategoryButton action="chevron" icon={BxRightArrowCircle} description={$_('app.home.goto-testers_desc')}>
                            {$_('app.home.goto-testers')}
                        </CategoryButton>
                    </a>
                {:else}
                    <a href="/invite/Testers">
                        <CategoryButton action="chevron" icon={BxGroup} description={$_('app.home.join-testers_desc')}>{$_('app.home.join-testers')}</CategoryButton>
                    </a>
                {/if}
            </div>
            {#if isDecember}
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a href="#" on:click={toggleSeasonalTheme}>
                Turn {seasonalTheme ? "off" : "on"} homescreen effects
            </a>
            {/if}
        </div>
    </div>
</div>


<style>
    .home {
        height: 100%;
        user-select: none;
        position: relative;
    }
    .home .homeScreen {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        padding: 12px;
    }
    .homeScreen h3 {
        margin: 20px 0;
        font-size: 48px;
        text-align: center;
    }
    .homeScreen h3 :global(img) {
        height: 36px;
    }

    .homeScreen a {
        font-size: 13px;
    }
    .homeScreen .actions {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        max-width: 650px;
        margin-bottom: 30px;
    }
    .homeScreen .actions > :global(* > *) {
        height: 100%;
    }
    .homeScreen .actions a {
        width: 100%;
        height: 6em;
    }
    .homeScreen .actions a div {
        margin: 0;
    }

    .homeScreen .actions :global([data-light="true"] .home svg) {
        filter: invert(100%);
    }
    @media (max-width: 600px) {
        .homeScreen .actions {
            grid-template-columns: repeat(1, 1fr);
        }
    }
</style>
