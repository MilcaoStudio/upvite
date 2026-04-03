<script lang="ts">
    import { API, Message as IMessage } from "stoat.js";
    import dayjs from "dayjs";
    import isEqual from "lodash.isequal";
    import type { ChannelRenderer } from "$lib/rendered/Singleton.svelte";
    import Start from "./Start.svelte";
    import BxX from "svelte-boxicons/BxX.svelte";
    import TextSvelte, { createTextSnippet } from "$lib/i18n/TextSvelte.svelte";
    import { decodeTime } from "ulid";
    import MessageDivider from "../indicators/MessageDivider.svelte";
    import Message from "./Message.svelte";
    import { css, cx } from "@emotion/css";
    import MessageEditor from "./MessageEditor.svelte";
    import { internalEmit, internalSubscribe } from "$lib/InternalEmitter";
    import Markdown from "$lib/markdown/Markdown.svelte";
    import SystemMessage from "./SystemMessage.svelte";
    import { useClient } from "../client/ClientContext.svelte";
    import { useState } from "../state/StateContext.svelte";
    import type { QueuedMessage } from "../state/stores/MessageQueue";

    interface Props {
        lastId?: string | undefined;
        highlight?: string | undefined;
        renderer: ChannelRenderer;
    }

    let {
        lastId = undefined,
        highlight = undefined,
        renderer,
    }: Props = $props();

    const Blocked = cx(
        "BlockedMessage",
        css`
            font-size: 0.8em;
            margin-top: 6px;
            padding: 4px 64px;
            color: var(--tertiary-foreground);

            &:hover {
                background: var(--hover);
            }
        `,
    );
    const client = useClient();
    const userId = client.user!.id;
    const queue = useState().queue;
    
    let messageQueue: MessageQueueItem[] = $state([]);
    type MessageQueueItem = {
        type: "Blocked",
        count: number,
    } | {
        type: "User",
        data: IMessage,
    } | {
        type: "System",
        data: IMessage,
    } | {
        type: "Divider",
        date?: string,
        unread: boolean,
    } | {
        type: "New",
        data: QueuedMessage,
    };

    /*
    $: if (renderer) {
        render.unshift(createElement(Start, { channel: renderer.channel }));
    } else {
        render.unshift(createElement(Preloader, { type: "ring" }));
    }*/

    let previous: IMessage | undefined;
    let head = $state(true);
    let divided = $state(false);
    let editing = $state<string>();

    function stopEditing() {
        editing = undefined;
        internalEmit("TextArea", "focus", "message");
    }

    function compare(
        current: string,
        curAuthor: string | undefined,
        currentMasq: API.Masquerade | undefined,
        previous: string,
        prevAuthor?: string,
        previousMasq?: API.Masquerade,
    ) {
        head = false;
        const atime = decodeTime(current),
            adate = new Date(atime),
            btime = decodeTime(previous),
            bdate = new Date(btime);

        let unread = false;
        if (!divided && lastId && previous >= lastId) {
            unread = true;
            divided = true;
        }

        let date;
        if (
            adate.getFullYear() != bdate.getFullYear() ||
            adate.getMonth() != bdate.getMonth() ||
            adate.getDate() != bdate.getDate()
        ) {
            date = adate;
        }

        if (unread || date) {
            messageQueue.push({type: "Divider", date: date && dayjs(date).format("LL"), unread})
            head = true;
        }
        head =
            head ||
            curAuthor != prevAuthor ||
            Math.abs(btime - atime) >= 420_000 ||
            !isEqual(currentMasq, previousMasq);
    }
    let blocked = $state(0);

    function pushBlocked() {
        messageQueue.push({type: "Blocked", count: blocked});
        blocked = 0;
    }

    function preloadMessages() {
        previous = undefined;
        for (const message of renderer.messages) {
            if (previous) {
                compare(
                    message.id,
                    message.authorId,
                    message.masquerade,
                    previous.id,
                    previous.authorId,
                    previous.masquerade,
                );
            }

            // System messages
            if (message.authorId == "00000000000000000000000000") {
                messageQueue.push({type: "System", data: message});
            } else if (message.author?.relationship == "Blocked") {
                blocked++;
            } else {
                if (blocked > 0) {
                    pushBlocked();
                }

                messageQueue.push({type: "User", data: message});
            }

            previous = message;
        }
        if (blocked > 0) pushBlocked();
    }

    $effect(() => {
        const nonces = renderer.messages.map((x) => x.nonce);
        if (renderer.atBottom) {
            for (const message of queue.get(renderer.channel.id)) {
                if (nonces.includes(message.id)) continue;

                if (previous) {
                    compare(
                        message.id,
                        userId,
                        undefined,
                        previous.id,
                        previous.authorId,
                        previous.masquerade,
                    );
                }

                console.info("Message created:", JSON.stringify(message.data));
                messageQueue.push({type: "New", data: message});
            }
        }
    });

    $effect(() => {
        function editLast() {
            if (renderer.state != "RENDER") return;
            for (let i = renderer.messages.length - 1; i >= 0; i--) {
                if (renderer.messages[i].authorId == userId) {
                    editing = renderer.messages[i].id;
                    internalEmit("MessageArea", "jump_to_bottom");
                    return;
                }
            }
        }

        const subs = [
            internalSubscribe("MessageRenderer", "edit_last", editLast),
            internalSubscribe(
                "MessageRenderer",
                "edit_message",
                (e) => (editing = e as string),
            ),
        ];
        return () => subs.forEach((unsub) => unsub());
    });

    $effect.pre(preloadMessages);
</script>

{#snippet UserMessage(message: IMessage)}
    <Message {message} {head} highlight={highlight == message.id}>
        {#if editing == message.id}
            <MessageEditor {message} onFinish={stopEditing} />
        {:else}
            <Markdown content={message.content} />
        {/if}
    </Message>
{/snippet}

{#snippet NewMessage(reference: QueuedMessage)}
    {@const message = client.messages.getOrCreate(reference.id, {...reference.data, replies: reference.data.replies.map((x)=>x.id)})}
    <Message {message} queued={reference} {head} />
{/snippet}

{#if renderer.atTop}
    <Start channel={renderer.channel} />
{/if}

{#each messageQueue as item}
    {#if item.type == "Divider"}
        <MessageDivider date={item.date} unread={item.unread} />
    {:else if item.type == "Blocked"}
        <div class={Blocked}>
            <BxX size=16 /> <TextSvelte id="app.main.channel.misc.blocked_messages" fields={{count: createTextSnippet(()=>""+item.count)}} />
        </div>
    {:else if item.type == "System"}
        <SystemMessage message={item.data} highlight={highlight == item.data.id} />
    {:else if item.type == "User"}
        {@render UserMessage(item.data)}
    {:else if item.type == "New"}
        {@render NewMessage(item.data)}
    {/if}
{/each}
