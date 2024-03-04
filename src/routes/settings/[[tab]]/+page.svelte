<script lang="ts">
    import { goto, replaceState } from "$app/navigation";

    import UprisingApp from "$lib/components/UprisingApp.svelte";

    import Appearance from "$lib/components/settings/personal/appearance.svelte";
    import Profile from "$lib/components/settings/personal/profile.svelte";

    import type { ComponentType } from "svelte";
    import ConditionalLink from "$lib/components/atoms/ConditionalLink.svelte";
    import ButtonItem from "$lib/components/navigation/items/ButtonItem.svelte";
    import {
        BxArrowBack,
        BxGlobe,
        BxPalette,
        BxTransfer,
        BxUserCircle,
        BxWrench,
        BxX,
    } from "svelte-boxicons";
    import GenericSidebarBase from "$lib/components/navigation/GenericSidebarBase.svelte";
    import { t } from "svelte-i18n";
    import Category from "$lib/components/atoms/Category.svelte";
    import SidebarBase from "$lib/components/navigation/SidebarBase.svelte";
    import H1 from "$lib/components/atoms/heading/H1.svelte";
    import { state } from "$lib/State.js";
    import { isTouchscreenDevice } from "$lib";
    import Header from "$lib/components/atoms/Header.svelte";
    import IconButton from "$lib/components/atoms/input/IconButton.svelte";

    const Pages: Record<string, ComponentType> = {
        profile: Profile,
        appearance: Appearance,
    };
    export let data;
    let closing = false;

    $: exitSettings = function(){
        closing = true;
        setTimeout(() => {
            goto(state.layout.getLastPath());
        }, 200);
    }

    $: keyDown = function(ev: KeyboardEvent){
        if (ev.key == "Escape") {
            exitSettings();
        }
    }
    function switchPage(to?: string) {
        if (to) {
            goto(`/settings/${to}`);
        } else {
            goto(`/settings`);
        }
    }
    $: tab = data.tab;
    if (!tab) {
        goto("/settings/profile");
    }
</script>

<svelte:body on:keydown={keyDown} />

<UprisingApp>
    <SidebarBase slot="left">
        <GenericSidebarBase>
            <div class="sidebar">
                <Category>User preferences</Category>
                <ConditionalLink
                    active={tab == "profile"}
                    href="/settings/profile"
                >
                    <ButtonItem active={tab == "profile"}>
                        <BxUserCircle size={24} />
                        <span>{$t("app.settings.pages.profile.title")}</span>
                    </ButtonItem>
                </ConditionalLink>
                <ConditionalLink
                    active={tab == "appearance"}
                    href="/settings/appearance"
                >
                    <ButtonItem active={tab == "appearance"}>
                        <BxPalette size={24} />
                        <span>{$t("app.settings.pages.appearance.title")}</span>
                    </ButtonItem>
                </ConditionalLink>
                <ConditionalLink active={tab == "sync"} href="/settings/sync">
                    <ButtonItem active={tab == "Sync"}>
                        <BxTransfer size={24} />
                        <span>{$t("app.settings.pages.sync.title")}</span>
                    </ButtonItem>
                </ConditionalLink>
                <ConditionalLink
                    active={tab == "language"}
                    href="/settings/language"
                >
                    <ButtonItem active={tab == "language"}>
                        <BxGlobe size={24} />
                        <span>{$t("app.settings.pages.language.title")}</span>
                    </ButtonItem>
                </ConditionalLink>
                <ConditionalLink active={tab == "dev"} href="/settings/dev">
                    <ButtonItem active={tab == "dev"}>
                        <BxWrench size={24} />
                        <span>{$t("app.navigation.tabs.dev")}</span>
                    </ButtonItem>
                </ConditionalLink>
                <ConditionalLink active={tab == "TF2"} href="/settings/tf2">
                    <ButtonItem active={tab == "TF2"}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="24"
                            height="24"
                            viewBox="0 0 48 48"
                        >
                            <path
                                fill="#bf862a"
                                d="M40.533 12.733c-.343 5.552-2.248 9.362-7.629 10.067l-2.419-.324c-.429-1.867-1.648-3.429-3.286-4.333l1.829-13.505C33.771 5.867 37.838 8.79 40.533 12.733zM17.962 26.81c-.629 1.952-1.838 2.905-2.533 2.905-4.619 0-7.619 0-11.362-4.086C4.019 25.095 4 24.552 4 24c0-.105 0-.2.01-.305l13.505 1.829C17.619 25.971 17.762 26.4 17.962 26.81zM24.305 4.01l-1.829 13.505c-1.867.429-3.429 1.648-4.333 3.286L4.638 18.971C6.867 10.362 14.686 4 24 4 24.105 4 24.2 4 24.305 4.01z"
                            ></path><g
                                ><path
                                    fill="#a2632c"
                                    d="M20.8 29.857l-1.829 13.505c-8.105-2.095-14.21-9.143-14.905-17.733 3.295.79 7.219 1.229 11.838 1.229.695 0 1.381-.019 2.057-.048C18.552 28.105 19.552 29.171 20.8 29.857zM43.362 29.029C41.133 37.638 33.314 44 24 44c-.105 0-.2 0-.305-.01l1.829-13.505c1.867-.429 3.429-1.648 4.333-3.286L43.362 29.029zM44 24c0 .105 0 .2-.01.305L32.905 22.8c3.848-2.362 6.505-5.743 7.629-10.067C42.724 15.943 44 19.819 44 24z"
                                ></path></g
                            >
                        </svg>
                        <span>Team Fortress 2</span>
                    </ButtonItem>
                </ConditionalLink>
            </div>
        </GenericSidebarBase>
    </SidebarBase>
    {#if isTouchscreenDevice}
        <Header palette="primary" withTransparency>
            {#if tab}
                <IconButton onClick={()=>switchPage()}>
                    <BxArrowBack size={24} />
                    {$t(`app.settings.pages.${tab}.title`)}
                </IconButton>
            {:else}
               <IconButton onClick={exitSettings}>
                    <BxX size={27} />
                </IconButton> 
            {/if}
        </Header>
    {/if}
    <div class="scrollbox" data-scroll-offset={isTouchscreenDevice ? "with-padding" : undefined}>
        <div class="content">
        {#if tab}
            <H1>{$t(`app.settings.pages.${tab}.title`)}</H1>
            <svelte:component this={Pages[tab]} />
        {/if}
        </div> 
    </div>
    
</UprisingApp>

<style>
    .sidebar {
        flex: 1 0 300px;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        padding: 40px 8px 0 0;
        background: var(--secondary-background);
    }
    .content {
        display: flex;
        gap: 13px;
        max-width: 740px;
        padding: 80px 32px;
        width: 100%;
        flex-direction: column;
    }
    .scrollbox {
        display: flex;
        flex-grow: 1;
        align-items: stretch;
        overflow-y: scroll;
        transition: visibility .1s;
    }
</style>