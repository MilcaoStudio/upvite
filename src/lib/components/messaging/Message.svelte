<script lang="ts">
    import type { QueuedMessage } from "$lib/stores/MessageQueue";
    import { css, cx } from "@emotion/css";
    import type { Message as MessageType } from "revolt.js";
    import { modalController } from "../modals/ModalController";
    import { internalEmit } from "$lib/InternalEmitter";
    import UserIcon from "../user/UserIcon.svelte";
    import Category from "../atoms/Category.svelte";
    import { _ } from "svelte-i18n";
    import MessageBase from "./MessageBase.svelte";
    import MessageInfo from "./MessageInfo.svelte";
    import MessageDetail from "./MessageDetail.svelte";
    import Username from "../user/Username.svelte";
    export let message: MessageType & {
            webhook?: { name: string; avatar?: string };
        },
        head = false,
        // turns on context menu
        //attachContent = false,
        replacement: string | undefined = undefined,
        queued: QueuedMessage | undefined = undefined,
        highlight = false,
        contrast = false,
        hideReply = false;
    const Wrapper = cx(
        "Wrapper",
        css`
            display: flex;
            flex-direction: column;
        `,
    );

    const client = message.client;
    const user = message.author;

    const content = message.content;
    head = head || (message.reply_ids ? message.reply_ids.length > 0 : false);

    function openProfile() {
        modalController.push({
            type: "user_profile",
            user_id: message.author_id,
        });
    }

    function handleUserClick(e: MouseEvent) {
        if (e.shiftKey && user?._id) {
            internalEmit("MessageBox", "append", `<@${user._id}>`, "mention");
        } else {
            openProfile();
        }
    }

    let mouseHover = false;
    let reactionOpen = false;
    $: replacement && (mouseHover = false);
</script>

<div class={Wrapper} id={message._id}>
    <!--TODO: Reply-->
    <MessageBase
        {highlight}
        head={hideReply
            ? false
            : (head && !(message.reply_ids && message.reply_ids.length > 0)) ??
              false}
        {contrast}
        sending={typeof queued != "undefined"}
        mention={message.mention_ids && client.user
            ? message.mention_ids.includes(client.user._id)
            : undefined}
        failed={typeof queued?.error != "undefined"}
    >
        <MessageInfo click={typeof head != "undefined"}>
            {#if head}
                <UserIcon
                    url={message.generateMasqAvatarURL()}
                    override={message.webhook?.avatar
                        ? `https://autumn.revolt.chat/avatars/${message.webhook.avatar}`
                        : undefined}
                    target={user}
                    onClick={handleUserClick}
                    size={36}
                    showServerIdentity
                />
            {:else}
                <MessageDetail {message} position="left" />
            {/if}
        </MessageInfo>
        <div class="MessageContent">
            {#if head}
            <span class="detail">
               <Username
                    {user}
                    class="author"
                    showServerIdentity
                    onClick={handleUserClick}
                    masquerade={message.masquerade}
                    override={message.webhook?.name}
                />
                <MessageDetail
                    message={message}
                    position="top"
                />
            </span>
            {/if}
            <!--Markdown here-->
            {replacement ?? content}

            <!--InviteList-->
            {#if queued?.error}
                <Category>{$_(queued.error)}</Category>
            {/if}
            <!--Attachments-->
            <!--Embeds-->
            <!--Reactions-->
            <!--MessageOverlaybar-->
        </div>
    </MessageBase>
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
