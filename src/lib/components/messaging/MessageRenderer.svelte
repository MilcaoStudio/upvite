<script lang="ts">
    import { API, Message as IMessage, type Nullable } from "revolt.js";
    import dayjs from "dayjs";
    import isEqual from "lodash.isequal";
    import { state } from "$lib/State";
    import { useClient } from "$lib/controllers/ClientController";
    import type { ChannelRenderer } from "$lib/rendered/Singleton";
    import JSXRender from "../JSXRender.svelte";
    import Start from "./Start.svelte";
    import BxX from "svelte-boxicons/BxX.svelte";
    import TextSvelte from "$lib/i18n/TextSvelte.svelte";
    import { decodeTime } from "ulid";
    import MessageDivider from "../indicators/MessageDivider.svelte";
    import Message from "./Message.svelte";
    import { css, cx } from "@emotion/css";
    import { autorun, runInAction, spy } from "mobx";
    import {
        createElement,
        type SvelteElement,
        type SvelteNode,
    } from "$lib/markdown/runtime/svelteRuntime";
    import MessageEditor from "./MessageEditor.svelte";
    import { internalEmit, internalSubscribe } from "$lib/InternalEmitter";
    import Markdown from "$lib/markdown/Markdown.svelte";
    import SystemMessage from "./SystemMessage.svelte";

    export let lastId: string | undefined = undefined,
        highlight: string | undefined = undefined,
        renderer: ChannelRenderer;

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
    const client = useClient()!;
    const userId = client.user!._id;
    const queue = state.queue;
    let render: SvelteElement[] = [];

    /*
    $: if (renderer) {
        render.unshift(createElement(Start, { channel: renderer.channel }));
    } else {
        render.unshift(createElement(Preloader, { type: "ring" }));
    }*/

    let previous: IMessage | undefined;
    let head = true;
    let divided = false;
    let editing: string | null = null;

    function stopEditing() {
        editing = null;
        internalEmit("TextArea", "focus", "message");
    }

    function compare(
        current: string,
        curAuthor: string,
        currentMasq: Nullable<API.Masquerade>,
        previous: string,
        prevAuthor: string,
        previousMasq: Nullable<API.Masquerade>,
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
            render.push(
                createElement(MessageDivider, {
                    date: date && dayjs(date).format("LL"),
                    unread,
                }),
            );
            head = true;
        }
        head =
            head ||
            curAuthor != prevAuthor ||
            Math.abs(btime - atime) >= 420_000 ||
            !isEqual(currentMasq, previousMasq);
    }
    let blocked = 0;
    function pushBlocked() {
        render.push(
            createElement(
                "div",
                { class: Blocked },
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

    $: autorun(() => {
        function editLast() {
            if (renderer.state != "RENDER") return;
            for (let i = renderer.messages.length - 1; i >= 0; i--) {
                if (renderer.messages[i].author_id == userId) {
                    editing = renderer.messages[i]._id;
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

    $: autorun(renderMessages);

    $: renderMessages(), editing;

    function renderMessages() {
        render = [];
        for (const message of renderer.messages) {
            if (previous) {
                compare(
                    message._id,
                    message.author_id,
                    message.masquerade,
                    previous._id,
                    previous.author_id,
                    previous.masquerade,
                );
            }

            // System messages
            if (message.author_id == "00000000000000000000000000") {
                render.push(createElement(SystemMessage, {message, highlight: highlight == message._id}))
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
                            highlight: highlight == message._id,
                        },
                        // FIXME: can this be faster?
                        editing == message._id ? createElement(MessageEditor, {message, onFinish: stopEditing}) : createElement(Markdown, {content: message.content})
                    ),
                );
            }

            previous = message;
        }
        if (blocked > 0) pushBlocked();
    }
    //$: editing && spy((ev)=>ev.spyReportStart);
    /*
    $: {
        const messageIndex = render.findIndex(
            (m) => m.type == Message && m.props?.message._id == editing,
        );
        if (messageIndex != -1) {
            const messageRef = render[messageIndex];
            // Copies props from ref into new element
            render[messageIndex] = createElement(Message, messageRef.props, createElement(MessageEditor, {
                    message: messageRef.props?.message,
                    onFinish: stopEditing,
                }),);
        }
    }*/

    autorun(() => {
        const nonces = renderer.messages.map((x) => x.nonce);
        if (renderer.atBottom) {
            for (const message of queue.get(renderer.channel._id)) {
                if (nonces.includes(message.id)) continue;

                if (previous) {
                    compare(
                        message.id,
                        userId!,
                        null,
                        previous._id,
                        previous.author_id,
                        previous.masquerade,
                    );

                    previous = {
                        _id: message.id,
                        author_id: userId!,
                    } as IMessage;
                }

                console.info("Message created:", JSON.stringify(message.data));

                render.push(
                    createElement(Message, {
                        message: new IMessage(client, {
                            ...message.data,
                            replies: message.data.replies.map((x: any) => x.id),
                        }),
                        queued: message,
                        head,
                    }),
                );
            }
        }
    });
</script>

{#if renderer.atTop}
    <Start channel={renderer.channel} />
{/if}
{#each render as node}
    <JSXRender {node} />
{/each}
