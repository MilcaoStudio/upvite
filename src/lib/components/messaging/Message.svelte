<script lang="ts">
    import type { QueuedMessage } from "$lib/stores/MessageQueue";
    import { css, cx } from "@emotion/css";
    import type { Message as MessageType } from "revolt.js";
    import { modalController } from "../modals/ModalController";
    import { internalEmit } from "$lib/InternalEmitter";
    import UserIcon from "../user/UserIcon.svelte";
    import Category from "../atoms/Category.svelte";
    import { _ } from "svelte-i18n";
    export let message: MessageType & {webhook?: {name: string, avatar?: string}},
        head = false,
        // turns on context menu
        //attachContent = false,
        replacement: string | undefined = undefined,
        queued: QueuedMessage | undefined = undefined;
        //highlight = false,
        //contrast = false,
        //hideReply = false;
    const Wrapper = cx(
        "Wrapper",
        css`
            display: flex;
            flex-direction: column;
            ${head ? `padding-top: 14px;` : ``}
        `,
    );

    const client = message.client;
    const user = message.author;

    const content = message.content;
    head = head || (message.reply_ids ? message.reply_ids.length > 0 : false);

    function openProfile(){
        modalController.push({
            type: "user_profile",
            user_id: message.author_id,
        })
    }

    function handleUserClick(e: MouseEvent){
        if (e.shiftKey && user?._id) {
            internalEmit(
                    "MessageBox",
                    "append",
                    `<@${user._id}>`,
                    "mention",
            );
        } else {
            openProfile()
        }
    }

    let mouseHover = false;
    let reactionOpen = false;
    $: replacement && (mouseHover = false)
</script>

<div class={Wrapper} id={message._id}>
    <!--TODO: Reply-->
    <div class="Message">
        <div class="MessageTail">
            {#if head}
                <UserIcon url={message.generateMasqAvatarURL()}
                override={
                    message.webhook?.avatar
                        ? `https://autumn.revolt.chat/avatars/${message.webhook.avatar}`
                        : undefined
                }
                target={user}
                size={36}
                showServerIdentity
                />
            {/if}
        </div>
        <div class="MessageContent">
            {#if head}
                <span class="detail">
                    {user?.username}
                </span>
            {/if}
            <!--Markdown here-->
            <div style="    width: 100%;">
                {replacement ?? content}
            </div>
            
            <!--InviteList-->
            {#if queued?.error}
                <Category>{$_(queued.error)}</Category>
            {/if}
            <!--Attachments-->
            <!--Embeds-->
            <!--Reactions-->
            <!--MessageOverlaybar-->
        </div>
    </div>
</div>

<style>
    div.Message {
        display: flex;
        line-height: 18px;
    }

    /* Make time sent and edited components uniform */
    /*div.Message time {
        font-size: 10px;
        color: var(--tertiary-foreground);
    }*/

    div.MessageTail {
        width: 62px;
        display: flex;
        justify-content: center;
    }

    div.MessageContent {
        font-size: 14px;
        color: var(--foreground);
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    div.MessageHead {
        gap: 6px;
        display: flex;
    }

    div.MessageHead span {
        font-weight: 600;
    }
</style>
