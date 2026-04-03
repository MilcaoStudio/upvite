<script lang="ts">
    import { css, cx } from "@emotion/css";
    import GenericSidebarBase from "../GenericSidebarBase.svelte";
    import GenericSidebarList from "../GenericSidebarList.svelte";
    import { isTouchscreenDevice } from "$lib";
    import { t } from "svelte-i18n";
    import ConditionalLink from "$lib/components/atoms/ConditionalLink.svelte";
    import ButtonItem from "../items/ButtonItem.svelte";
    import BxHome from "svelte-boxicons/BxHome.svelte";
    import BxNotepad from "svelte-boxicons/BxNotepad.svelte";
    import BxPlus from "svelte-boxicons/BxPlus.svelte";
    import BxsUserDetail from "svelte-boxicons/BxsUserDetail.svelte";

    import Category from "$lib/components/atoms/Category.svelte";
    import { modalController } from "$lib/components/modals/ModalController";
    import placeholder from "../items/placeholder.svg";
    import ChannelButton from "../items/ChannelButton.svelte";
    import IconButton from "$lib/components/atoms/input/IconButton.svelte";
    import UserPanel from "./UserPanel.svelte";
    import type { Channel } from "stoat.js";
    import { useClient } from "$lib/components/client/ClientContext.svelte";
    import { page } from "$app/state";

    interface Props {
        channel?: Channel
    }

    let { channel }: Props = $props();
    const Navbar = cx(
        "Navbar",
        css`
            display: flex;
            align-items: center;
            padding: 0 14px;
            font-weight: 600;
            flex-shrink: 0;
            height: 48px;
            ${isTouchscreenDevice() && `height:56px;`}
        `,
    );
    const client = useClient();
    let pathname = $derived(page.url.pathname);
    let channel_id = $derived(page.params.channel);
    let channels: Channel[] = $derived([...client.channels.values()]
        .filter(
            (x) =>
                (x.type == "DirectMessage" && x.active) ||
                x.type == "Group",
        )
        .sort((b, a) =>
            (a.lastMessageId || "").localeCompare(b.lastMessageId || ""),
        )
    );
    let incoming = $derived([...client.users.values()].filter(
        (user) => user?.relationship == "Incoming",
    ));
</script>

{#snippet ChannelItem(channel: Channel)}
    {@const user = channel.recipient}
    {@const isUnread = channel.unread}
    {@const mentionCount = channel.mentions?.size || 0}
    <ConditionalLink active={channel.id == channel_id} href="/channel/{channel.id}">
        <ChannelButton active={channel.id == channel_id} {user} {channel} alert={mentionCount > 0 ? "mention" : isUnread ? "unread" : undefined} />
    </ConditionalLink>
{/snippet}

<GenericSidebarBase >
    <div class={Navbar}>
        {$t("app.home.directs")}
    </div>
    <!--ConnectionStatus-->
    <GenericSidebarList>
        <ConditionalLink active={pathname == "/"} href="/">
            <ButtonItem active={pathname == "/"}>
                <BxHome size={20} />
                <span>{$t("app.navigation.tabs.home")}</span>
            </ButtonItem>
        </ConditionalLink>
        
            <ConditionalLink active={pathname == "/friends"} href="/friends">
                <ButtonItem
                    active={pathname == "/friends"}
                    alert={incoming.length ? "mention" : undefined}
                    alertCount={incoming.length}
                >
                    <BxsUserDetail size={20} />
                    <span>{$t("app.navigation.tabs.friends")}</span>
                </ButtonItem>
            </ConditionalLink>
      
        <ConditionalLink
            active={channel?.type == "SavedMessages"}
            href="/open/saved"
        >
            <ButtonItem active={channel?.type == "SavedMessages"}>
                <BxNotepad size={20} />
                <span>{$t("app.navigation.tabs.saved")}</span>
            </ButtonItem>
        </ConditionalLink>
        <Category>
            {$t("app.main.categories.conversations")}
            <IconButton
                onClick={() =>
                    modalController.push({
                        type: "create_group",
                    })}
            >
                <BxPlus size={16} />
            </IconButton>
        </Category>
        {#if !channels.length}
            <img alt="empty channel list" src={placeholder} loading="eager" />
        {/if}
        {#each channels as channel}
            {@render ChannelItem(channel)}
        {/each}
    </GenericSidebarList>
    <UserPanel />
</GenericSidebarBase>
