<script lang="ts">
    import { goto } from "$app/navigation";
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import Appearance from "$lib/components/settings/personal/appearance.svelte";
    import Profile from "$lib/components/settings/personal/profile.svelte";
    import Scroller from "$lib/components/settings/common/scroller.svelte";
    import Item from "$lib/components/settings/common/buttonSimple.svelte";
    import Category from "$lib/components/settings/common/category.svelte";

    import type { ComponentType } from "svelte";
    import ScrollerContent from "$lib/components/settings/common/scrollerContent.svelte";
    import { state } from "$lib/State";
    import { modalController } from "$lib/components/modals/ModalController";
    import {
        APP_VERSION,
        GIT_BRANCH,
        GIT_REVISION,
        REPO_URL,
    } from "$lib/revision";
    import { useClient } from "$lib/controllers/ClientController";
    import { LIBRARY_VERSION } from "revolt.js";

    const Pages: Record<string, ComponentType> = {
        Profile: Profile,
        Appearance: Appearance,
    };
    const client = useClient();
    export let data;
    let closing = false;
    $: tab = data.tab;
    if (!tab) {
        goto("/settings/Profile");
    }

    function exitSettings() {
        closing = true;
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

<UprisingApp>
    <div class="flex-column">
        <Scroller>
            <Category>User preferences</Category>
            <Item href="Profile" active={tab == "Profile"}>
                <svg
                    slot="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-user"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
                        d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"
                    /><path
                        d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"
                    /></svg
                >
                Profile</Item
            >
            <Item href="Appearance" active={tab == "Appearance"}>
                <svg
                    slot="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-palette"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
                        d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25"
                    /><path
                        d="M8.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
                    /><path
                        d="M12.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
                    /><path
                        d="M16.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
                    /></svg
                >
                Appearance</Item
            >
            <Item href="Notifications" active={tab == "Notifications"}>
                <svg
                    slot="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-bell"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
                        d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"
                    /><path d="M9 17v1a3 3 0 0 0 6 0v-1" /></svg
                >
                Notifications</Item
            >
            <Item href="Chat" active={tab == "Chat"}>
                <svg
                    slot="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-message-dots"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
                        d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4"
                    /><path d="M12 11l0 .01" /><path d="M8 11l0 .01" /><path
                        d="M16 11l0 .01"
                    /></svg
                >
                Chat</Item
            >
            <Item href="Language" active={tab == "Language"}>
                <svg
                    slot="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-world"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
                        d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"
                    /><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path
                        d="M11.5 3a17 17 0 0 0 0 18"
                    /><path d="M12.5 3a17 17 0 0 1 0 18" /></svg
                >
                Language</Item
            >
            <Item href="Devmode" active={tab == "Devmode"}>
                <svg
                    slot="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-code-circle"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
                        d="M10 14l-2 -2l2 -2"
                    /><path d="M14 10l2 2l-2 2" /><path
                        d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"
                    /></svg
                >
                Dev mode</Item
            >
            <Item href="Tf2" active={tab == "TF2"}>
                <svg
                    slot="svg"
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
                TF2
            </Item>
            <div class="version">
                <span>
                    <a
                        href="{REPO_URL}/{GIT_REVISION}"
                        target="_blank"
                        rel="noreferrer">{GIT_REVISION.slice(0, 7)}</a
                    >{" "}
                    <a
                        href={GIT_BRANCH != "DETACHED"
                            ? `https://github.com/MilcaoStudio/upvite/tree/${GIT_BRANCH}`
                            : undefined}
                        target="_blank"
                        rel="noreferrer"
                    >
                        ({GIT_BRANCH})
                    </a>
                </span>
                <span>
                    {GIT_BRANCH == "main" ? "Stable" : "Nightly"}{" "}
                    {APP_VERSION}
                </span>
                <span>API: {client.configuration?.revolt ?? "N/A"}</span>
                <span>revolt.js: {LIBRARY_VERSION}</span>
            </div>
        </Scroller>

        <ScrollerContent>
            <h1>{tab}</h1>

            {#if tab}
                <svelte:component this={Pages[tab]} />
            {/if}
        </ScrollerContent>
    </div>
</UprisingApp>

<style>
    .flex-column {
        display: flex;
        flex-direction: row;
    }

    .version {
        margin-top: 1rem;
        font-size: 12px;
        color: var(--secondary-foreground);
        font-family: var(--monospace-font), monospace;
        user-select: text;
        display: grid;
    }
    .version a:hover {
        text-decoration: underline;
    }
</style>
