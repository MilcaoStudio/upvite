<script lang="ts">
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
    import { useClient } from "../client/ClientContext.svelte";

    const client = useClient();
    let users = $state([...client.users.values()]);
    
    $effect(() => {
        users.sort((a, b) => a.username.localeCompare(b.username));
    });
    let friends = $derived(users.filter((x) => x.relationship == "Friend"));
    let online = $derived(friends.filter((x) => x.online && x.status?.presence != "Invisible"));
    let offline = $derived(friends.filter((x) => !x.online || x.status?.presence == "Invisible"));
    let incoming = $derived(users.filter((x) => x.relationship == "Incoming"));
    let outgoing = $derived(users.filter((x) => x.relationship == "Outgoing"));
    let isEmpty =
        $derived([friends, incoming, outgoing].reduce(
            (p: number, n) => p + n.length,
            0,
        ) == 0);
</script>


<div style="position: relative;" data-scroll-offset="true" data-avoids-navigation="true">
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
            >
                {#snippet summary()}
                    {$t("app.special.friends.pending")} - {incoming.length}
                {/snippet}
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
            >
                {#snippet summary()}
                    {$t("app.special.friends.sent")} - {outgoing.length}
                {/snippet}
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
            >
            {#snippet summary()}
                {$t("app.status.online")} - {online.length}
            {/snippet}
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
            >
            {#snippet summary()}
                {$t("app.status.offline")} - {offline.length}
            {/snippet}
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
        padding-bottom: var(--bottom-navigation-height);
        padding-top: var(--header-height);
    }

    .grid[data-empty="true"] {
        gap: 16px;
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }

    /*.grid[data-mobile="true"] {
        padding-bottom: var(--bottom-navigation-height);
        padding-top: var(--header-height);
    }*/

    .UserGrid {
        display: flex;
        flex-direction: column;
    }
</style>
