<script lang="ts">
    import { internalSubscribe } from "$lib/InternalEmitter";
    import { state } from "$lib/State";
    import { SECTION_MENTION } from "$lib/stores/Layout";
    import type { Reply } from "$lib/stores/MessageQueue";
    import { MAX_REPLIES } from "$lib/types/messaging";
    import type { Channel, Message } from "revolt.js";
    import { onDestroy, onMount } from "svelte";
    import ReplyBase from "../attachments/Reply.svelte";
    import { t } from "svelte-i18n";
    import UserShort from "$lib/components/user/UserShort.svelte";
    import BxFile from "svelte-boxicons/BxFile.svelte";
    import Markdown from "$lib/markdown/Markdown.svelte";
    import IconButton from "$lib/components/atoms/input/IconButton.svelte";
    import Tooltip from "$lib/components/atoms/Tooltip.svelte";
    import At from "svelte-boxicons/BxAt.svelte";
    import XCircle from "svelte-boxicons/BxXCircle.svelte";

    export let channel: Channel,
        replies: Reply[],
        setReplies: (replies: Reply[]) => void;
    let client = channel.client;
    const layout = state.layout;

    // Add new messages to reply bar.
    function addReply(msg: Message) {
        if (
            replies.length >= MAX_REPLIES ||
            replies.find((x) => x.id == msg._id)
        ) {
            return;
        }

        setReplies([
            ...replies,
            {
                id: msg._id,
                mention:
                    msg.author_id == client.user!._id
                        ? false
                        : layout.getSectionState(SECTION_MENTION, false),
            },
        ]);
    }

    let unsubscribe: Function;
    onMount(
        () =>
            (unsubscribe = internalSubscribe(
                "ReplyBar",
                "add",
                addReply as () => void,
            )),
    );
    onDestroy(() => unsubscribe?.());

    // Map all the replies to messages we are aware of.
    $: messages = replies.map((x) => client.messages.get(x.id));
    $: if (messages.includes(undefined)) {
        setReplies(replies.filter((_, i) => typeof messages[i] != "undefined"));
    }
</script>


<div>
    {#each messages as message, index (message?._id)}
        {#if message}
            <div class="ReplyBar">
                <ReplyBase preview>
                    <div class="replyto">
                        {$t("app.main.channel.reply.replying")}
                    </div>
                    <div class="content">
                        <div class="username">
                            <UserShort
                                size={16}
                                showServerIdentity
                                user={message.author}
                                masquerade={message.masquerade}
                            />
                        </div>
                        <div class="message">
                            {#if message.attachments}
                                <BxFile size={16} />
                                <em
                                    >{message.attachments.length > 1
                                        ? $t(
                                              "app.main.channel.misc.sent_multiple_files",
                                          )
                                        : $t(
                                              "app.main.channel.misc.sent_file",
                                          )}</em
                                >
                            {/if}
                            {#if message.author_id == "00000000000000000000000000"}
                                <!--TODO: System message-->
                                <div></div>
                            {:else if message.content}
                                <Markdown
                                    content={message.content
                                        .slice(0, 50)
                                        .replace(/\n/g, " ")}
                                />
                            {/if}
                        </div>
                    </div>
                </ReplyBase>
                <span class="actions">
                    {#if message.author_id != client.user?._id}
                        <IconButton onClick={()=>replies[index].mention = !replies[index].mention}>
                            <Tooltip
                                content={$t("app.main.channel.reply.toggle")}
                            >
                                <span class="toggle">
                                    <At size={18} />
                                    {$t(
                                        replies[index].mention
                                            ? "general.on"
                                            : "general.off",
                                    )}
                                </span>
                            </Tooltip>
                        </IconButton>
                    {/if}
                    <IconButton
                        onClick={() =>
                            setReplies(replies.filter((_, i) => i != index))}
                    >
                        <XCircle size={20} />
                    </IconButton>
                </span>
            </div>
        {/if}
    {/each}
</div>

<style>
    .ReplyBar {
        display: flex;
        height: 30px;
        padding: 0 20px;
        user-select: none;
        align-items: center;
        justify-content: space-between;
        animation: bottomBounce 340ms cubic-bezier(0.2, 0.9, 0.5, 1.16) forwards;
    }
    .replyto {
        align-self: center;
        font-weight: 500;
        flex-shrink: 0;
    }
    .content {
        display: flex;
        pointer-events: none;
    }

    .username {
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 600;
        flex-shrink: 0;
    }

    .message {
        display: flex;
        max-height: 26px;
        gap: 4px;
    }

    .actions {
        gap: 12px;
        display: flex;
    }
</style>
