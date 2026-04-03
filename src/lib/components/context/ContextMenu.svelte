<script lang="ts">
    import type { Action, ContextMenuData } from "$lib/types/ContextMenus";
    import { ContextMenu } from "fluent-svelte";
    import LineDivider from "../atoms/LineDivider.svelte";
    import MenuItem from "./MenuItem.svelte";
    import { t } from "svelte-i18n";
    import { modalController } from "../modals/ModalController";
    import { getRenderer } from "$lib/rendered/Singleton.svelte";
    import { internalEmit } from "$lib/InternalEmitter";
    //import { state } from "$lib/State";
    import { takeError } from "$lib";
    import { Permission, UserPermission } from "stoat.js";
    import Tooltip from "../atoms/Tooltip.svelte";
    import { setContext, type Snippet } from "svelte";
    import { goto } from "$app/navigation";
    import { useClient } from "../client/ClientContext.svelte";
    import { useState } from "../state/StateContext.svelte";

    let client = useClient();
    let userId = client.user?.id;
    interface Props {
        data: ContextMenuData;
        children?: Snippet;
    }

    let { data, children }: Props = $props();
    let lastDivider = false;
    let isOpen = $state(false);
    let queue = useState().queue;

    async function onClick(data?: Action) {
        console.log("Context menu action", data);
        if (!data) {
            return;
        }
        try {
            switch (data.action) {
                case "copy_id":
                    modalController.writeText(data.id);
                    break;
                case "copy_message_link":
                    {
                        let pathname = `/channel/${data.message.channelId}/${data.message.id}`;
                        const channel = data.message.channel;
                        if (channel?.type == "TextChannel") {
                            pathname = `/server/${channel.serverId}${pathname}`;
                        }
                        modalController.writeText(origin + pathname);
                    }
                    break;
                case "mark_as_read":
                    {
                        data.channel.ack();
                    }
                    break;
                case "mark_unread":
                    {
                        // local ack
                        const messages = getRenderer(
                            data.message.channel!,
                        ).messages;
                        const index = messages.findIndex(
                            (x) => x.id == data.message.id,
                        );

                        let unread_id = data.message.id;
                        if (index > 0) {
                            unread_id = messages[index - 1].id;
                        }
                        internalEmit("NewMessages", "mark", unread_id);

                        // request ack
                        data.message.channel?.ack(unread_id, true);
                    }
                    break;
                case "retry_message":
                    {
                        const nonce = data.message.id;
                        const fail = (error: string) =>
                            queue.fail(nonce, error);
                        client.channels
                            .get(data.message.channel)!
                            .sendMessage({
                                nonce: data.message.id,
                                content: data.message.data.content,
                                replies: data.message.data.replies,
                            })
                            .catch(fail);

                        queue.start(nonce);
                    }
                    break;
                case "cancel_message":
                    queue.remove(data.message.id);
                    break;
                case "mention":
                    internalEmit(
                        "MessageBox",
                        "append",
                        `<@${data.user}>`,
                        "mention",
                    );
                    break;
                case "reply_message":
                    internalEmit("ReplyBar", "add", data.target);
                    break;
                case "edit_message":
                    internalEmit("MessageRenderer", "edit_message", data.id);
                    break;
                case "open_channel_settings":
                    await goto(`/channel/${data.id}/settings`);
                    break;
                case "open_server_channel_settings":
                    await goto(
                        `/server/${data.server}/channel/${data.id}/settings`,
                    );
                    break;
                case "open_server_settings":
                    await goto(`/server/${data.id}/settings`);
                    break;
                case "open_file":
                    window.open(data.attachment.originalUrl, "_blank")?.focus();
                    break;
                case "save_file":
                    window.open(
                        data.attachment.originalUrl.replace(
                            "attachments",
                            "attachments/download",
                        ),
                        window.native ? "_blank" : "_self",
                    );
                    break;
                case "open_link":
                    window.open(data.link, "_blank")?.focus();
                    break;
                case "copy_text":
                    modalController.writeText(data.content);
                    break;
                case "copy_link":
                    modalController.writeText(data.link);
                    break;
                case "delete_message":
                    modalController.push({
                        type: "delete_message",
                        target: data.target,
                    });
                    break;
                case "leave_group":
                case "close_dm":
                case "delete_channel":
                case "create_invite":
                    modalController.push({
                        type: data.action,
                        target: data.target,
                    });
                    break;
                case "leave_server":
                case "delete_server":
                case "create_channel":
                case "create_category":
                    modalController.push({
                        type: data.action,
                        target: data.target,
                    });
                    break;
                case "ban_member":
                case "kick_member":
                    modalController.push({
                        type: data.action,
                        member: data.target,
                    });
                    break;
                case "view_profile":
                    modalController.push({
                        type: "user_profile",
                        user_id: data.user.id,
                    });
            }
        } catch (err) {
            modalController.push({
                type: "error",
                error: takeError(err),
            });
        } finally {
            isOpen = false;
        }
    }

    let options: {
        action?: Action;
        withDivider: boolean;
        locale?: string;
        disabled: boolean;
        tip?: Snippet;
        color?: string;
    }[] = [];
    function makeAction(
        action?: Action,
        locale?: string,
        withDivider = false,
        disabled = false,
        color?: string,
        tip?: Snippet,
    ) {
        options.push({ action, withDivider, locale, disabled, tip, color });
    }
    $effect(() => {
        if (data.server_list) {
            const server = client.servers.get(data.server_list)!;
            if (server) {
                if (server.havePermission("ManageChannel")) {
                    makeAction({
                        action: "create_category",
                        target: server,
                    });
                    makeAction({
                        action: "create_channel",
                        target: server,
                    });
                }

                if (server.havePermission("ManageServer"))
                    makeAction({
                        action: "open_server_settings",
                        id: data.server_list,
                    });
            }
        } else {
            const cid = data.channel;
            const uid = data.user;
            const sid = data.server;
            const cxid = data.contextualChannel;
            const channel = cid ? client.channels.get(cid) : undefined;
            const contextualChannel = cxid
                ? client.channels.get(cxid)
                : undefined;
            const targetChannel = channel ?? contextualChannel;

            const user = uid ? client.users.get(uid) : undefined;
            const serverChannel =
                targetChannel && targetChannel.type == "TextChannel"
                    ? targetChannel
                    : undefined;
            const s = serverChannel ? serverChannel.serverId! : sid;
            const server = s ? client.servers.get(s) : undefined;

            const channelPermissions = targetChannel?.permission || 0n;
            const serverPermissions =
                (server
                    ? server.permission
                    : serverChannel
                      ? serverChannel.server?.permission
                      : 0n) || 0n;
            const userPermissions = (user ? user.permission : 0) || 0;
            if (data.unread) {
                if (channel) {
                    makeAction({ action: "mark_as_read", channel });
                } else if (server) {
                    makeAction(
                        {
                            action: "mark_server_as_read",
                            server,
                        },
                        "mark_as_read",
                    );
                }
            }
            if (contextualChannel) {
                if (user && user.id != userId) {
                    makeAction(
                        {
                            action: "mention",
                            user: user.id,
                        },
                        undefined,
                        true,
                    );
                }
            }
            if (user) {
                let actions: (Action["action"] | boolean)[];
                switch (user.relationship) {
                    case "User":
                        actions = [];
                        break;
                    case "Friend":
                        actions = [!user.bot && "remove_friend", "block_user"];
                        break;
                    case "Incoming":
                        actions = ["add_friend", "cancel_friend", "block_user"];
                        break;
                    case "Outgoing":
                        actions = [!user.bot && "cancel_friend", "block_user"];
                        break;
                    case "Blocked":
                        actions = ["unblock_user"];
                        break;
                    case "BlockedOther":
                        actions = ["block_user"];
                        break;
                    case "None":
                    default:
                        if ((user.flags && 2) || (user.flags && 4)) {
                            actions = ["block_user"];
                        } else {
                            actions = [!user.bot && "add_friend", "block_user"];
                        }
                }
                if (userPermissions & UserPermission.ViewProfile) {
                    makeAction({
                        action: "view_profile",
                        user,
                    });
                }
                if (user.id != userId) {
                    if (userPermissions & UserPermission.SendMessage) {
                        makeAction({
                            action: "message_user",
                            user,
                        });
                    } else {
                        makeAction(
                            undefined,
                            undefined,
                            false,
                            true,
                            undefined,
                            MessageUser,
                        );
                    }
                }
                for (const action of actions) {
                    if (action) {
                        makeAction({
                            action,
                            user,
                        } as Action);
                    }
                }

                if (contextualChannel) {
                    if (contextualChannel.type == "Group" && uid) {
                        if (
                            contextualChannel.ownerId == userId &&
                            userId != uid
                        ) {
                            makeAction(
                                {
                                    action: "make_owner",
                                    channel: contextualChannel,
                                    user: user!,
                                },
                                undefined,
                                false,
                                undefined,
                                "var(--error)",
                            );

                            makeAction(
                                {
                                    action: "remove_member",
                                    channel: contextualChannel,
                                    user: user!,
                                },
                                undefined,
                                false,
                                undefined,
                                "var(--error)",
                            );
                        }
                    }
                }

                makeAction({ action: "copy_id", id: user.id }, "copy_uid");
            }
            const { queued, message, attachment } = data;
            if (queued) {
                makeAction({
                    action: "retry_message",
                    message: queued,
                });

                makeAction({
                    action: "cancel_message",
                    message: queued,
                });
            }

            if (message && !queued) {
                const sendPermission =
                    message.channel &&
                    message.channel.permission & Permission.SendMessage;

                if (sendPermission) {
                    makeAction({
                        action: "reply_message",
                        target: message,
                    });
                }

                makeAction({
                    action: "mark_unread",
                    message,
                });

                if (
                    typeof message.content == "string" &&
                    message.content.length > 0
                ) {
                    if (sendPermission) {
                        makeAction({
                            action: "quote_message",
                            content: message.content,
                        });
                    }

                    makeAction({
                        action: "copy_text",
                        content: message.content,
                    });
                }

                if (message.authorId == userId) {
                    makeAction({
                        action: "edit_message",
                        id: message.id,
                    });
                }

                if (
                    message.authorId == userId ||
                    channelPermissions & Permission.ManageMessages
                ) {
                    makeAction(
                        {
                            action: "delete_message",
                            target: message,
                        },
                        undefined,
                        true,
                        undefined,
                        "var(--error)",
                    );
                }

                if (message.authorId != userId) {
                    makeAction(
                        {
                            action: "report",
                            target: message,
                        },
                        "report_message",
                        undefined,
                        undefined,
                        "var(--error)",
                    );
                }

                if (
                    message.attachments &&
                    message.attachments.length == 1 // if there are multiple attachments, the individual ones have to be clicked
                ) {
                    const { metadata } = message.attachments[0];
                    const { type } = metadata;

                    makeAction(
                        {
                            action: "open_file",
                            attachment: message.attachments[0],
                        },
                        type == "Image"
                            ? "open_image"
                            : type == "Video"
                              ? "open_video"
                              : "open_file",
                        true,
                    );

                    makeAction(
                        {
                            action: "save_file",
                            attachment: message.attachments[0],
                        },
                        type == "Image"
                            ? "save_image"
                            : type == "Video"
                              ? "save_video"
                              : "save_file",
                    );

                    makeAction(
                        {
                            action: "copy_file_link",
                            attachment: message.attachments[0],
                        },
                        "copy_link",
                    );
                }

                if (document.activeElement?.tagName == "A") {
                    const link = document.activeElement.getAttribute("href");
                    if (link) {
                        makeAction(
                            { action: "open_link", link },
                            undefined,
                            true,
                        );
                        makeAction({ action: "copy_link", link });
                    }
                }

                makeAction({ action: "copy_id", id: message.id }, "copy_mid");
            }

            if (attachment) {
                const { metadata } = attachment;
                const { type } = metadata;

                makeAction(
                    {
                        action: "open_file",
                        attachment,
                    },
                    type == "Image"
                        ? "open_image"
                        : type == "Video"
                          ? "open_video"
                          : "open_file",
                    true,
                );

                makeAction(
                    {
                        action: "save_file",
                        attachment,
                    },
                    type == "Image"
                        ? "save_image"
                        : type == "Video"
                          ? "save_video"
                          : "save_file",
                );

                makeAction(
                    {
                        action: "copy_file_link",
                        attachment,
                    },
                    "copy_link",
                );
            }
            const id = sid ?? cid ?? uid ?? message?.id;
            if (id) {
                if (channel) {
                    if (channel.type) {
                        makeAction(
                            {
                                action: "open_notification_options",
                                channel,
                            },
                            undefined,
                            true,
                            //<ChevronRight size={24} />,
                        );
                    }

                    switch (channel.type) {
                        case "Group":
                            // ! makeAction({ action: "create_invite", target: channel }); FIXME: add support for group invites
                            makeAction(
                                {
                                    action: "open_channel_settings",
                                    id: channel.id,
                                },
                                "open_group_settings",
                            );
                            makeAction(
                                {
                                    action: "leave_group",
                                    target: channel,
                                },
                                "leave_group",
                            );
                            break;
                        case "DirectMessage":
                            makeAction({
                                action: "close_dm",
                                target: channel,
                            });
                            break;
                        case "TextChannel":
                            if (channelPermissions & Permission.InviteOthers) {
                                makeAction({
                                    action: "create_invite",
                                    target: channel,
                                });
                            }

                            if (serverPermissions & Permission.ManageServer)
                                makeAction(
                                    {
                                        action: "open_server_channel_settings",
                                        server: channel.serverId,
                                        id: channel.id,
                                    },
                                    "open_channel_settings",
                                );

                            if (serverPermissions & Permission.ManageChannel)
                                makeAction(
                                    {
                                        action: "delete_channel",
                                        target: channel,
                                    },
                                    undefined,
                                    undefined,
                                    undefined,
                                    "var(--error)",
                                );
                            break;
                    }
                    makeAction(
                        { action: "copy_id", id: channel.id },
                        "copy_cid",
                    );
                }
                if (sid && server) {
                    makeAction(
                        {
                            action: "open_notification_options",
                            server,
                        },
                        undefined,
                        undefined,
                        //<ChevronRight size={24} />,
                    );

                    if (server.channels[0])
                        makeAction(
                            {
                                action: "create_invite",
                                target: server.channels[0],
                            },
                            "create_invite",
                        );

                    if (
                        serverPermissions & Permission.ChangeNickname ||
                        serverPermissions & Permission.ChangeAvatar
                    )
                        makeAction(
                            {
                                action: "edit_identity",
                                target: server.member!,
                            },
                            "edit_identity",
                        );

                    if (serverPermissions & Permission.ManageServer)
                        makeAction(
                            {
                                action: "open_server_settings",
                                id: server.id,
                            },
                            "open_server_settings",
                        );

                    // workaround to move this above the delete/leave button
                    makeAction(
                        { action: "copy_id", id: sid },
                        "copy_sid",
                        true,
                    );
                    if (userId == server.owner) {
                        makeAction(
                            { action: "delete_server", target: server },
                            "delete_server",
                            undefined,
                            undefined,
                            "var(--error)",
                        );
                    } else {
                        /*
                                makeAction(
                                    {
                                        action: "report",
                                        target: server,
                                    },
                                    "report_server",
                                    undefined,
                                    undefined,
                                    "var(--error)",
                                );*/

                        makeAction(
                            { action: "leave_server", target: server },
                            "leave_server",
                            undefined,
                            undefined,
                            "var(--error)",
                        );
                    }
                }
            }
        }
    });
    setContext("Menu", onClick);
</script>

{#snippet MessageUser()}
    <Tooltip
        content="Must be friends with this user to message them."
        placement="left"
    >
        {$t("app.context_menu.message_user")}
    </Tooltip>
{/snippet}

{#snippet flyout()}
    {#each options as { action, locale, disabled, withDivider, color, tip } (action)}
        {#if withDivider}
            <LineDivider compact />
        {/if}
        <MenuItem data={action} {disabled}>
            <span style:color
                >{$t(`app.context_menu.${locale ?? action?.action}`)}</span
            >
            {#if tip}
                <div class="tip">{@render tip()}</div>
            {/if}
        </MenuItem>
    {/each}
{/snippet}

{#if options.length}
    <ContextMenu bind:open={isOpen}>
        {@render children?.()}
        {@render flyout()}
    </ContextMenu>
{:else}
    {@render children?.()}
{/if}
