<script lang="ts">
    import { page } from "$app/stores";
    import { useClient } from "$lib/controllers/ClientController";
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
    import { state } from "$lib/State";
    import { createElement } from "$lib/markdown/runtime/svelteRuntime";
    import ChannelButton from "../items/ChannelButton.svelte";
    import JsxRender from "$lib/components/JSXRender.svelte";
    import IconButton from "$lib/components/atoms/input/IconButton.svelte";
    import UserPanel from "./UserPanel.svelte";
    import { autorun } from "mobx";
    import type { Channel } from "revolt.js";

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
    $: pathname = $page.url.pathname;
    $: channel_id = $page.params.channel;
    $: channel = client.channels.get(channel_id);
    let channels: Channel[] = [];
    $: autorun(() => channels = [...client.channels.values()].filter(
        (x) =>
            (x.channel_type == "DirectMessage" && x.active) ||
            x.channel_type == "Group",
    ));
    channels.sort((b, a) =>
        a.last_message_id_or_past.localeCompare(b.last_message_id_or_past),
    );
    let incoming = [...client.users.values()].filter(
        (user) => user?.relationship == "Incoming",
    );

    $: channelList = channels.map((channel) => {
        let user;
        if (channel.channel_type == "DirectMessage") {
            if (!channel.active) return null;
            user = channel.recipient;
            if (!user) return null;
        }

        const isUnread = channel.isUnread(state.notifications);
        const mentionCount = channel.getMentions(state.notifications).length;
        return createElement(
            ConditionalLink,
            {
                active: channel._id == channel_id,
                href: `/channel/${channel._id}`,
            },
            createElement(ChannelButton, {
                user,
                channel,
                alert:
                    mentionCount > 0
                        ? "mention"
                        : isUnread
                          ? "unread"
                          : undefined,
                alertCount: mentionCount,
                active: channel._id == channel_id,
            }),
        );
    });
</script>

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
            active={channel?.channel_type == "SavedMessages"}
            href="/open/saved"
        >
            <ButtonItem active={channel?.channel_type == "SavedMessages"}>
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
        {#each channelList as channel}
            <JsxRender node={channel} />
        {/each}
    </GenericSidebarList>
    <UserPanel {client}/>
</GenericSidebarBase>
