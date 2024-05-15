<script lang="ts">
    import { useClient } from "$lib/controllers/ClientController";
    import { autorun } from "mobx";
    import PageHeader from "../atoms/PageHeader.svelte";
    import Friend from "./Friend.svelte";
    import UserDetail from "svelte-boxicons/BxUser.svelte";
    import UserPlus from "svelte-boxicons/BxUserPlus.svelte";
    import MessageAdd from "svelte-boxicons/BxMessageAdd.svelte";
    import Tooltip from "../atoms/Tooltip.svelte";
    import IconButton from "../atoms/input/IconButton.svelte";
    import CollapsibleSection from "../CollapsibleSection.svelte";
    import { t } from "svelte-i18n";
    import { modalController } from "../modals/ModalController";
    import { isTouchscreenDevice } from "$lib";

    const client = useClient();
    let users = [...client.users.values()];
    $: autorun(() => {
        users = [...client.users.values()];
    });
    $: users.sort((a, b) => a.username.localeCompare(b.username));
    $: friends = users.filter((x) => x.relationship == "Friend");
    $: online = friends.filter((x) => x.online && x.status?.presence != "Invisible");
    $: offline = friends.filter((x) => !x.online || x.status?.presence == "Invisible");
    $: incoming = users.filter((x) => x.relationship == "Incoming");
    $: outgoing = users.filter((x) => x.relationship == "Outgoing");
    $: isEmpty =
        [friends, incoming, outgoing].reduce(
            (p: number, n) => p + n.length,
            0,
        ) == 0;
</script>

<PageHeader icon={UserDetail} withTransparency noBurger>
    <div class="title">
        {$t("app.navigation.tabs.friends")}
    </div>
    <div class="actions">
        <Tooltip content="Create Group" placement="bottom">
            <IconButton
                onClick={() =>
                    modalController.push({
                        type: "create_group",
                    })}
            >
                <MessageAdd size={24} />
            </IconButton>
        </Tooltip>
        <Tooltip content="Add Friend" placement="bottom">
            <IconButton
                onClick={() =>
                    modalController.push({
                        type: "add_friend",
                    })}
            >
                <UserPlus size={27} />
            </IconButton>
        </Tooltip>
    </div>
</PageHeader>
<div data-scroll-offset="true" data-avoids-navigation="true">
    <div
        class="grid with-padding"
        data-empty={isEmpty}
        data-mobile={isTouchscreenDevice}
    >
        {#if isEmpty}
            {$t("app.special.friends.nobody")}
        {/if}
        {#if incoming.length}
            <CollapsibleSection
                id="friends_incoming"
                defaultValue
                sticky
                large
                summary="{$t("app.special.friends.pending")} - {incoming.length}"
            >
                <div class="UserGrid">
                    {#each incoming as user}
                        <Friend {user} />
                    {/each}
                </div>
            </CollapsibleSection>
        {/if}
        {#if outgoing.length}
            <CollapsibleSection
                id="friends_outgoing"
                defaultValue
                sticky
                large
                summary="{$t("app.special.friends.sent")} - {outgoing.length}"
            >
                <div class="UserGrid">
                    {#each outgoing as user}
                        <Friend {user} />
                    {/each}
                </div>
            </CollapsibleSection>
        {/if}
        {#if online.length}
            <CollapsibleSection
                id="friends_online"
                defaultValue
                sticky
                large
                summary="{$t("app.status.online")} - {online.length}"
            >
                <div class="UserGrid">
                    {#each online as user}
                        <Friend {user} />
                    {/each}
                </div>
            </CollapsibleSection>
        {/if}
        {#if offline.length}
            <CollapsibleSection
                id="friends_offline"
                defaultValue
                sticky
                large
                summary="{$t("app.status.offline")} - {offline.length}"
            >
                <div class="UserGrid">
                    {#each offline as user}
                        <Friend {user} />
                    {/each}
                </div>
            </CollapsibleSection>
        {/if}
    </div>
</div>

<style>
    .actions {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .grid {
        padding: 0 10px 10px;
        user-select: none;
    }

    .grid[data-empty="true"] {
        gap: 16px;
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }

    .grid[data-mobile="true"] {
        padding-bottom: var(--bottom-navigation-height);
    padding-top: var(--header-height);
    }

    .UserGrid {
        display: flex;
        flex-direction: column;
    }
</style>
