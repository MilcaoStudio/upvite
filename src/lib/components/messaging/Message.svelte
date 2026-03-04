<script lang="ts">
    import type { QueuedMessage } from "$lib/stores/MessageQueue";
    import { css, cx } from "@emotion/css";
    import type { Message as MessageType } from "stoat.js";
    import { modalController } from "../modals/ModalController";
    import { internalEmit } from "$lib/InternalEmitter";
    import UserIcon from "../user/UserIcon.svelte";
    import Category from "../atoms/Category.svelte";
    import { _ } from "svelte-i18n";
    import MessageBase from "./MessageBase.svelte";
    import MessageInfo from "./MessageInfo.svelte";
    import MessageDetail from "./MessageDetail.svelte";
    import Username from "../user/Username.svelte";
    import Markdown from "$lib/markdown/Markdown.svelte";
    import ContextMenu from "../context/ContextMenu.svelte";
    import Attachment from "./attachments/Attachment.svelte";
    import MessageReply from "./attachments/MessageReply.svelte";
    import Embed from "./embed/Embed.svelte";
    import { useClient } from "$lib/controllers/ClientController";
    interface Props {
        message: MessageType & {
            webhook?: { name: string; avatar?: string };
        };
        head?: boolean;
        queued?: QueuedMessage | undefined;
        highlight?: boolean;
        contrast?: boolean;
        hideReply?: boolean;
        compact?: boolean;
        children?: import('svelte').Snippet;
    }

    let {
        message,
        head = $bindable(false),
        queued = undefined,
        highlight = false,
        contrast = false,
        hideReply = false,
        compact = false,
        children
    }: Props = $props();
    
    const Wrapper = cx(
        "Wrapper",
        css`
            display: flex;
            flex-direction: column;
        `,
    );

    let client = $derived(useClient());
    let user = $derived(message.author);
    let content = $derived(message.content);
    head = head || (message.replyIds ? message.replyIds.length > 0 : false);

    function openProfile() {
        modalController.push({
            type: "user_profile",
            user_id: message.authorId ?? "",
            contextualServer: message.channel?.serverId ?? undefined
        });
    }

    function handleUserClick(e: MouseEvent) {
        if (e.shiftKey && user?.id) {
            internalEmit("MessageBox", "append", `<@${user.id}>`, "mention");
        } else {
            openProfile();
        }
    }

    let mouseHover = false;
    let reactionOpen = false;
</script>

<div class={Wrapper} id={message.id}>
    {#if !hideReply && message.replyIds}
        {#each message.replyIds as id, index}
            <MessageReply
                {index}
                {id}
                channel={message.channel}
                mentions={message.mentionIds ?? []}
            />
        {/each}
    {/if}
    <ContextMenu
        data={{ message, contextualChannel: message.channelId, queued }}
    >
        {#key message}
            <MessageBase
                {highlight}
                head={hideReply
                    ? false
                    : (head &&
                          !(
                              message.replyIds && message.replyIds.length > 0
                          )) ??
                      false}
                {contrast}
                sending={typeof queued != "undefined"}
                mention={message.mentionIds && client.user
                    ? message.mentionIds.includes(client.user.id)
                    : undefined}
                failed={typeof queued?.error != "undefined"}
            >
                <MessageInfo click={typeof head != "undefined"} showAlways={compact}>
                    {#if head && !compact}
                        <ContextMenu
                            data={{
                                user: user?.id,
                                contextualMessage: message.id,
                            }}
                        >
                            <UserIcon
                                url={message.masqueradeAvatarURL}
                                override={message.webhook?.avatar
                                    ? `https://autumn.revolt.chat/avatars/${message.webhook.avatar}`
                                    : undefined}
                                target={user}
                                onClick={handleUserClick}
                                size={36}
                                showServerIdentity
                            />
                        </ContextMenu>
                    {:else}
                        <MessageDetail {message} position="left" />
                    {/if}
                </MessageInfo>
                {#if compact}
                        <span class="detail" style:margin-right=".5rem">
                            <Username
                                {user}
                                class="author"
                                showServerIdentity
                                onClick={handleUserClick}
                                masquerade={message.masquerade}
                                override={message.webhook?.name}
                            />
                        </span>
                {/if}
                <div class="MessageContent">
                    {#if head && !compact}
                        <span class="detail">
                            <Username
                                {user}
                                class="author"
                                showServerIdentity
                                onClick={handleUserClick}
                                masquerade={message.masquerade}
                                override={message.webhook?.name}
                            />
                            <MessageDetail {message} position="top" />
                        </span>
                    {/if}
                    <!-- Slot default for message editor or markdown -->
                    {#if children}{@render children()}{:else}
                        <Markdown {content} />
                    {/if}

                    <!--InviteList-->
                    {#if queued?.error}
                        <Category>{$_(queued.error)}</Category>
                    {/if}
                    {#if message.attachments}
                        {#each message.attachments as attachment (attachment.id)}
                            <Attachment {attachment} />
                        {/each}
                    {/if}

                    {#if message.embeds}
                        {#each message.embeds as embed}
                            <Embed {embed} />
                        {/each}
                    {/if}
                    <!--Reactions-->
                    <!--MessageOverlaybar-->
                </div>
            </MessageBase>
        {/key}
    </ContextMenu>
</div>

<style>
    .detail {
        font-weight: 600;
        color: var(--secondary-foreground);
        font-size: 15px;
    }
    div.Message {
        display: flex;
        line-height: 18px;
        transition: 0.2s ease-in all;
    }

    div.Message:hover {
        background-color: var(--secondary-background);
        transition: 0.2s ease-in all;
    }

    div.MessageContent {
        position: relative;
        min-width: 0;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: var(--text-size);
    }

    div.MessageHead {
        gap: 6px;
        display: flex;
    }

    div.MessageHead span {
        font-weight: 600;
    }
</style>
