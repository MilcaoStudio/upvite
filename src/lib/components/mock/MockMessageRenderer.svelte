<script lang="ts">
    import { run } from 'svelte/legacy';

    import { API, Message as IMessage } from "stoat.js";
    import { createElement, type SvelteElement } from "$lib/markdown/runtime/svelteRuntime";
    import type { ChannelRenderer } from "$lib/rendered/Singleton";
    import MessageQueue from "$lib/stores/MessageQueue";
    import { useClient } from "./MockClient";
    import { dayjs } from "$lib/i18n";
    import isEqual from "lodash.isequal";
    import BxX from "svelte-boxicons/BxX.svelte";
    import { internalEmit, internalSubscribe } from "$lib/InternalEmitter";
    import { decodeTime } from "ulid";
    import MessageDivider from "../indicators/MessageDivider.svelte";
    import TextSvelte from "$lib/i18n/TextSvelte.svelte";
    import Markdown from "$lib/markdown/Markdown.svelte";
    import SystemMessage from "../messaging/SystemMessage.svelte";
    import MessageEditor from "../messaging/MessageEditor.svelte";
    import Message from "../messaging/Message.svelte";
    import { autorun } from "mobx";
    import Start from "../messaging/Start.svelte";
    import JSXRender from "../JSXRender.svelte";

    interface Props {
        lastId?: string | undefined;
        renderer: ChannelRenderer;
        highlight?: string | undefined;
    }

    let { lastId = undefined, renderer, highlight = undefined }: Props = $props();
    let client = useClient();
    let userId = client.user!.id;
    let queue = new MessageQueue;
    let render: SvelteElement[] = $state([]);
    let previous: IMessage | undefined;
    let head = true;
    let divided = false;
    let editing: string | null = $state(null);
    function stopEditing() {
        editing = null;
        internalEmit("TextArea", "focus", "message");
    }

    function compare(
        current: string,
        curAuthor: string | undefined,
        currentMasq: API.Masquerade | undefined,
        previous: string,
        prevAuthor?: string,
        previousMasq?:API.Masquerade,
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

        let element = null
        if (unread || date) {
            element = createElement(MessageDivider, {
                date: date && dayjs(date).format("LL"),
                unread,
            });
            render.push(element);
            head = true;
        }
        head =
            head ||
            curAuthor != prevAuthor ||
            Math.abs(btime - atime) >= 420_000 ||
            !isEqual(currentMasq, previousMasq);
        return element
    }
    let blocked = 0;
    function pushBlocked() {
        render.push(
            createElement(
                "div",
                { class: "BlockedMessage" },
                createElement(BxX, { size: 16 }),
                " ",
                createElement(TextSvelte, {
                    id: "app.main.channel.misc.blocked_messages",
                    fields: { count: blocked },
                }),
            ),
        );
        blocked = 0;
    }




    function renderMessages() {
        render = [];
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
                render.push(createElement(SystemMessage, {message, highlight: highlight == message.id}))
            } else if (message.author?.relationship == "Blocked") {
                blocked++;
            } else {
                if (blocked > 0) pushBlocked();

                render.push(
                    createElement(
                        Message,
                        {
                            message,
                            head,
                            highlight: highlight == message.id,
                        },
                        // FIXME: can this be faster?
                        editing == message.id ? createElement(MessageEditor, {message, onFinish: stopEditing}) : createElement(Markdown, {content: message.content})
                    ),
                );
            }

            previous = message;
        }
        if (blocked > 0) pushBlocked();
    }

    autorun(() => {
        const nonces = renderer.messages.map((x) => x.nonce);
        if (renderer.atBottom) {
            for (const message of queue.get(renderer.channel.id)) {
                if (nonces.includes(message.id)) continue;

                if (previous) {
                    compare(
                        message.id,
                        userId!,
                        undefined,
                        previous.id,
                        previous.authorId,
                        previous.masquerade,
                    );

                    /*
                    previous = {
                        _id: message.id,
                        author_id: userId!,
                    } as IMessage;*/
                }

                console.info("Message created:", JSON.stringify(message.data));

                render.push(
                    createElement(Message, {
                        message: client.messages.getOrCreate(
                            message.id,
                            {...message.data, replies: message.data.replies.map((x) => x.id)},
                            false),
                        queued: message,
                        head,
                    }),
                );
            }
        }
    });
    run(() => {
        autorun(() => {
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
    });
    run(() => {
        autorun(renderMessages);
    });
    run(() => {
        renderMessages(), editing;
    });
</script>

{#if renderer.atTop}
    <Start channel={renderer.channel} />
{/if}
{#each render as node}
    <JSXRender {node} />
{/each}


<style>
    :global(.BlockedMessage) {
        font-size: 0.8em;
        margin-top: 6px;
        padding: 4px 64px;
        color: var(--tertiary-foreground);
    }
    :global(.BlockedMessage:hover){
        background: var(--hover);
    }
</style>
