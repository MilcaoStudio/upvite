<script lang="ts">
    import { run } from 'svelte/legacy';

    import { dayjs } from "$lib/i18n";
    import TextSvelte from "$lib/i18n/TextSvelte.svelte";
    import { _ } from "svelte-i18n";
    import { useClient } from "$lib/controllers/ClientController";
    import { useClient as useMockClient } from "../mock/MockClient";
    import BxHappyBeaming from "svelte-boxicons/BxHappyBeaming.svelte";
    import BxSend from "svelte-boxicons/BxSend.svelte";
    import BxShieldX from "svelte-boxicons/BxShieldX.svelte";
    import type { DraftObject } from "$lib/stores/Draft";
    import { state } from "$lib/State";
    import { internalEmit, internalSubscribe } from "$lib/InternalEmitter";
    import { ulid } from "ulid";
    import type { Reply } from "$lib/stores/MessageQueue";
    import type { API, Channel } from "stoat.js";
    import {
        CAN_UPLOAD_AT_ONCE,
        ATTACHMENT_SIZE_LIMIT,
        type EmojiCategory,
        type EmojiInfo,
        type UploadState,
    } from "$lib/types/messaging";
    import { css, cx } from "@emotion/css";
    import {
        SMOOTH_SCROLL_ON_RECEIVE,
        getRenderer,
    } from "$lib/rendered/Singleton";
    import { getRenderer as getMockRenderer } from "../mock/MockRenderer";
    import { debounce, defer, isTouchscreenDevice, takeError } from "$lib";
    import Autocomplete, { useAutoComplete } from "../Autocomplete.svelte";
    import PermissionTooltip from "../atoms/PermissionTooltip.svelte";
    import { Checkbox, Flyout } from "fluent-svelte";
    import IconButton from "../atoms/input/IconButton.svelte";
    import Picker from "../atoms/media/Picker.svelte";
    import { autorun } from "mobx";
    import FileUploader from "$lib/controllers/FileUploader.svelte";
    import { grabFiles, uploadFile } from "$lib/types/FileUpload";
    import FilePreview from "./bars/FilePreview.svelte";
    import { modalController } from "../modals/ModalController";
    import ReplyBar from "./bars/ReplyBar.svelte";
    import TextEditor from "../atoms/input/TextEditor.svelte";
    import { orderingStore } from "$lib/stores/Ordering";
    import TextAreaAutoSize from "../atoms/TextAreaAutoSize.svelte";

    interface Props {
        channel: Channel;
        mock?: boolean;
    }

    let { channel, mock = false }: Props = $props();
    const client = mock ? useMockClient() : useClient();
    let uploadState: UploadState = $state({ type: "none" });
    let replies: Reply[] = $state([]);
    let typing = 0;

    let value = $state("");
    const Base = cx(
        "MessageBox",
        css`
            z-index: 1;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 0px 12px 0px 12px;
            margin: 0px 6px 6px 6px;
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
            background-color: rgba(var(--secondary-header-rgb), max(0, 0.86));
            background-color: rgba(var(--secondary-header-rgb), max(0, 0.86));
            border-radius: var(--border-radius-inner);
            textarea {
                font-size: var(--text-size);
                background: transparent;

                &::placeholder {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        `,
    );
    const Blocked = cx(
        "BoxBlocked",
        css`
            display: flex;
            align-items: center;
            user-select: none;
            font-size: var(--text-size);
            color: var(--tertiary-foreground);
            flex-grow: 1;
            cursor: not-allowed;

            .text {
                padding: var(--message-box-padding);
            }

            > div > div {
                cursor: default;
            }

            svg {
                flex-shrink: 0;
            }
        `,
    );

    const Action = cx(
        "Action",
        css`
            > a {
                height: 48px;
                width: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                /*padding: 14px 0 14px 14px;*/
            }

            .mobile {
                width: 62px;
            }

            ${!isTouchscreenDevice() ? `.mobile { display: none; }` : ``}
        `,
    );

    // For sed replacement
    const RE_SED = new RegExp("^s/([^])*/([^])*$");
    // Tests for code block delimiters (``` at start of line)
    const RE_CODE_DELIMITER = new RegExp("^```", "gm");

    const renderer = mock
        ? getMockRenderer(channel, state)
        : getRenderer(channel, state);

    function startTyping() {
        if (mock) return;
        if (typeof typing == "number" && +new Date() < typing) return;

        const ws = client.events;
        if (ws.state() == 2) {
            typing = +new Date() + 2500;
            ws.send({
                type: "BeginTyping",
                channel: channel.id,
            });
        }
    }

    function stopTyping(force?: boolean) {
        if (mock) return;
        if (typing) {
            const ws = client.events;
            if (ws.state() == 2) {
                typing = 0;
                ws.send({
                    type: "EndTyping",
                    channel: channel.id,
                });
            }
        }
    }

    let setMessage = function (content?: string) {
        const dobj: DraftObject = { content };
        state.draft.set(channel.id, dobj);
        value = content ?? value;
    };

    function append(content: string, action: "quote" | "mention") {
        const text =
            action == "quote"
                ? `${content
                      .split("\n")
                      .map((x) => `> ${x}`)
                      .join("\n")}\n\n`
                : `${content} `;

        if (!state.draft.has(channel.id)) {
            setMessage(text);
        } else {
            setMessage(`${state.draft.get(channel.id)?.content} ${text}`);
        }
    }

    internalSubscribe(
        "MessageBox",
        "append",
        append as (...args: unknown[]) => void,
    );

    /**
     * Send directly to mock client
     */
    function mockSend() {
        if (uploadState.type == "uploading" || uploadState.type == "sending")
            return;
        const content = state.draft.get(channel.id)?.content?.trim() ?? "";
        if (uploadState.type != "none") {
            return mockSendFile(content);
        }
        if (!content.length) {
            console.warn("Empty message cannot be sent");
            return;
        }
        internalEmit("NewMessages", "hide");
        stopTyping();
        setMessage();
        const messageReplies = replies;
        replies = [];
        const nonce = ulid();

        // sed style message editing.
        // If the user types for example `s/abc/def`, the string "abc"
        // will be replaced with "def" in their last sent message.
        if (RE_SED.test(content)) {
            replaceMessage(content, true);
        } else {
            //state.settings.sounds.playSound("outbound");

            state.queue.add(nonce, channel.id, {
                _id: nonce,
                channel: channel.id,
                author: client.user!.id,

                content,
                replies: messageReplies,
            });

            defer(() => renderer.jumpToBottom(SMOOTH_SCROLL_ON_RECEIVE));

            try {
                const messageId = ulid();
                client.emit(
                    "message",
                    client.messages.getOrCreate(messageId, {
                        _id: messageId,
                        channel: channel.id,
                        author: client.user!.id,
                        content,
                        nonce,
                        replies: messageReplies
                            .filter((r) => r.mention)
                            .map((r) => r.id),
                    }),
                );
            } catch (error) {
                state.queue.fail(nonce, takeError(error));
            }
        }
    }

    async function mockSendFile(content: string) {
        // Typescript does not like overlaps
        if (uploadState.type == "attached" || uploadState.type == "failed") {
            const attachments: API.File[] = [];
            const abortController = new AbortController();
            const files = uploadState.files;
            stopTyping();
            uploadState = {
                type: "uploading",
                files,
                percent: 0,
                cancel: abortController,
            };

            try {
                for (
                    let i = 0;
                    i < files.length && i < CAN_UPLOAD_AT_ONCE;
                    i++
                ) {
                    const file = files[i];

                    attachments.push(
                        await uploadFile(
                            client.configuration!.features.autumn.url,
                            "attachments",
                            file,
                            {
                                onDownloadProgress(event) {
                                    uploadState = {
                                        type: "uploading",
                                        files,
                                        percent: Math.round(
                                            (i * 100 +
                                                (100 * event.loaded) /
                                                    (event.total || 1)) /
                                                Math.min(
                                                    files.length,
                                                    CAN_UPLOAD_AT_ONCE,
                                                ),
                                        ),
                                        cancel: abortController,
                                    };
                                },
                                signal: abortController.signal,
                            },
                            true,
                        ),
                    );
                }
            } catch (err) {
                if (err instanceof Error && err.message == "cancel") {
                    uploadState = { type: "attached", files };
                    console.error(err);
                } else {
                    uploadState = {
                        type: "failed",
                        files,
                        error: takeError(err),
                    };
                }

                console.error("[MessageBox] Error uploading files", err);

                // Stops function
                return;
            }

            uploadState = { type: "sending", files };
            const nonce = ulid();
            try {
                // Emits message to client
                const messageId = ulid();
                client.emit(
                    "message",
                    client.messages.getOrCreate(messageId, {
                        _id: messageId,
                        channel: channel.id,
                        author: client.user!.id,
                        content,
                        nonce,
                        replies: replies
                            .filter((r) => r.mention)
                            .map((r) => r.id),
                        attachments,
                        // mentions
                    }),
                );
            } catch (err) {
                uploadState = { type: "failed", files, error: takeError(err) };
                return;
            }

            setMessage();
            replies = [];
            // state.settings.sounds.playSound("outbound");
            if (files.length > CAN_UPLOAD_AT_ONCE) {
                uploadState = {
                    type: "attached",
                    files: files.slice(CAN_UPLOAD_AT_ONCE),
                };
            } else {
                uploadState = { type: "none" };
            }
        }
    }

    async function replaceMessage(content: string, mock = false) {
        renderer.messages.reverse();
        const msg = renderer.messages.find(
            (msg) => msg.authorId == client.user!.id,
        );
        renderer.messages.reverse();

        if (msg?.content) {
            let [_, toReplace, newText, flags] = content.split(/\//);

            if (toReplace == "*") toReplace = msg.content.toString();

            const newContent =
                toReplace == ""
                    ? msg.content.toString() + newText
                    : msg.content
                          .toString()
                          .replace(new RegExp(toReplace, flags), newText);

            if (newContent != msg.content) {
                if (newContent.length == 0) {
                    if (mock) {
                        client.emit("message/delete", msg.id, channel);
                    } else {
                        msg.delete().catch(console.error);
                    }
                } else {
                    try {
                        if (mock) {
                            client.emit("message/update", {
                                ...msg,
                                content: newContent.slice(0, 2000),
                            });
                        } else {
                            await msg.edit({
                                content: newContent.slice(0, 2000),
                            });
                        }
                        defer(() =>
                            renderer.jumpToBottom(SMOOTH_SCROLL_ON_RECEIVE),
                        );
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        }
    }
    /**
     * Trigger send message.
     */
    async function send() {
        if (uploadState.type == "uploading" || uploadState.type == "sending")
            return;
        const content = state.draft.get(channel.id)?.content?.trim() ?? "";
        if (uploadState.type != "none") {
            return sendFile(content);
        }
        if (!content.length) return;
        internalEmit("NewMessages", "hide");
        stopTyping();
        setMessage();
        const messageReplies = replies;
        replies = [];
        const nonce = ulid();

        // sed style message editing.
        // If the user types for example `s/abc/def`, the string "abc"
        // will be replaced with "def" in their last sent message.
        if (RE_SED.test(content)) {
            replaceMessage(content);
        } else {
            //state.settings.sounds.playSound("outbound");

            state.queue.add(nonce, channel.id, {
                _id: nonce,
                channel: channel.id,
                author: client.user!.id,

                content,
                replies: messageReplies,
            });

            defer(() => renderer.jumpToBottom(SMOOTH_SCROLL_ON_RECEIVE));

            try {
                await channel.sendMessage({
                    content,
                    nonce,
                    replies: messageReplies,
                });
            } catch (error) {
                state.queue.fail(nonce, takeError(error));
            }
        }
    }

    async function sendFile(content: string) {
        // Typescript does not like overlaps
        if (uploadState.type == "attached" || uploadState.type == "failed") {
            const attachments: string[] = [];
            const abortController = new AbortController();
            const files = uploadState.files;
            stopTyping();
            uploadState = {
                type: "uploading",
                files,
                percent: 0,
                cancel: abortController,
            };

            try {
                for (
                    let i = 0;
                    i < files.length && i < CAN_UPLOAD_AT_ONCE;
                    i++
                ) {
                    const file = files[i];
                    attachments.push(
                        await uploadFile(
                            client.configuration!.features.autumn.url,
                            "attachments",
                            file,
                            {
                                onDownloadProgress(event) {
                                    uploadState = {
                                        type: "uploading",
                                        files,
                                        percent: Math.round(
                                            (i * 100 +
                                                (100 * event.loaded) /
                                                    (event.total || 1)) /
                                                Math.min(
                                                    files.length,
                                                    CAN_UPLOAD_AT_ONCE,
                                                ),
                                        ),
                                        cancel: abortController,
                                    };
                                },
                                signal: abortController.signal,
                            },
                        ),
                    );
                }
            } catch (err) {
                if (err instanceof Error && err.message == "cancel") {
                    uploadState = { type: "attached", files };
                    console.error(err);
                } else {
                    uploadState = {
                        type: "failed",
                        files,
                        error: takeError(err),
                    };
                }

                console.error("[MessageBox] Error uploading files", err);

                // Stops function
                return;
            }

            uploadState = { type: "sending", files };
            const nonce = ulid();
            try {
                await channel.sendMessage({
                    content,
                    nonce,
                    replies,
                    attachments,
                });
            } catch (err) {
                uploadState = { type: "failed", files, error: takeError(err) };
                return;
            }

            setMessage();
            replies = [];
            // state.settings.sounds.playSound("outbound");
            if (files.length > CAN_UPLOAD_AT_ONCE) {
                uploadState = {
                    type: "attached",
                    files: files.slice(CAN_UPLOAD_AT_ONCE),
                };
            } else {
                uploadState = { type: "none" };
            }
        }
    }

    let {
        onChange,
        onKeyUp,
        onKeyDown,
        onFocus,
        onBlur,
        ...autoCompleteProps
    } = useAutoComplete(setMessage, {
        users: { type: "channel", id: channel.id },
        channels:
            channel.type == "TextChannel"
                ? { server: channel.serverId }
                : undefined,
    });

    let servers = orderingStore.orderedServers;

    let emojis: Record<string, EmojiInfo[]> = $state({});
    let categories: EmojiCategory[] = $state([]);
    run(() => {
        autorun(() => {
            value = state.draft.get(channel.id)?.content ?? "";
        });
    });
    let debounceStopTyping = $derived(debounce(stopTyping, 1000));
    run(() => {
        autorun(() => {
            categories = [];
            for (const server of $servers) {
                // ! FIXME: add a separate map on each server for emoji
                const list = [...client.emojis.values()]
                    .filter(
                        (emoji) =>
                            emoji.parent.type != "Detached" &&
                            emoji.parent.id == server.id,
                    )
                    .map(({ id, name }) => ({ id, name }));

                if (list.length) {
                    emojis[server.id] = list;
                    categories.push({
                        id: server.id,
                        name: server.name,
                        iconURL: server.animatedIconURL,
                    });
                }
            }
            categories.push({
                id: "default",
                name: "Default",
                emoji: "smiley",
            });
        });
    });
</script>

{#if channel.server?.member?.timeout}
    <div class={Base}>
        <div class={Blocked}>
            <div class={Action}>
                <PermissionTooltip permission="SendMessages" placement="top">
                    <BxShieldX size={22} />
                </PermissionTooltip>
            </div>
            <div class="text">
                <TextSvelte
                    id="app.main.channel.misc.timed_out"
                    fields={{
                        time: dayjs(
                            channel.server.member.timeout,
                        ).toISOString(),
                    }}
                />
            </div>
        </div>
    </div>
{:else if !channel.havePermission("SendMessage") && !mock}
    <div class={Base}>
        <div class={Blocked}>
            <div class={Action}>
                <PermissionTooltip permission="SendMessages" placement="top">
                    <BxShieldX size={22} />
                </PermissionTooltip>
            </div>
            <div class="text">
                {$_("app.main.channel.misc.no_sending")}
            </div>
        </div>
    </div>
{:else}
    <Autocomplete {...autoCompleteProps} />
    <FilePreview
        state={uploadState}
        addFile={() => {
            uploadState.type == "attached" &&
                grabFiles(
                    ATTACHMENT_SIZE_LIMIT,
                    (files) => {
                        if (uploadState.type == "none") {
                            return;
                        }
                        uploadState = {
                            type: "attached",
                            files: [...uploadState.files, ...files],
                        };
                    },
                    () =>
                        modalController.push({
                            type: "error",
                            error: "FileTooLarge",
                        }),
                    true,
                );
        }}
        removeFile={(index) => {
            if (uploadState.type != "attached") return;
            if (uploadState.files.length == 1) {
                uploadState = { type: "none" };
            } else {
                uploadState = {
                    type: "attached",
                    files: uploadState.files.filter((_, i) => index != i),
                };
            }
        }}
    />
    <ReplyBar {replies} setReplies={(_replies) => (replies = _replies)} />

    <div class={Base}>
        {#if channel.havePermission("UploadFiles")}
            <div class={Action}>
                <FileUploader
                    fileType="attachments"
                    maxFileSize={ATTACHMENT_SIZE_LIMIT}
                    remove={async () => {
                        uploadState = { type: "none" };
                    }}
                    style={{
                        size: 24,
                        type: "attachment",
                        attached: uploadState.type != "none",
                        uploading:
                            uploadState.type == "uploading" ||
                            uploadState.type == "sending",
                        cancel() {
                            uploadState.type == "uploading" &&
                                uploadState.cancel.abort("cancel");
                        },
                    }}
                    behavior={{
                        type: "multi",
                        append(files) {
                            if (!files.length) return;
                            if (uploadState.type == "none") {
                                uploadState = { type: "attached", files };
                            } else {
                                uploadState = {
                                    type: "attached",
                                    files: [...uploadState.files, ...files],
                                };
                            }
                        },
                        onChange(files) {
                            uploadState = { type: "attached", files };
                        },
                    }}
                />
            </div>
        {/if}

        <TextAreaAutoSize
            maxRows={20}
            id="message"
            maxlength="2000"
            minHeight={60}
            {value}
            onChange={(e) => {
                setMessage(e.currentTarget.value);
                startTyping();
                const t = e.currentTarget;
                onChange(t.value, t.selectionStart, t.selectionEnd);
            }}
            {onKeyUp}
            onKeyDown={(e) => {
                if (e.ctrlKey && e.key == "Enter") {
                    e.preventDefault();
                    return send();
                }

                if (onKeyDown(e)) return;

                if (e.key == "ArrowUp" && !state.draft.has(channel.id)) {
                    e.preventDefault();
                    internalEmit("MessageRenderer", "edit_last");
                    return;
                }

                if (
                    !e.shiftKey &&
                    !e.isComposing &&
                    e.key == "Enter" &&
                    !isTouchscreenDevice()
                ) {
                    e.preventDefault();
                    return send();
                }

                if (e.key == "Escape") {
                    if (replies.length) {
                        replies = replies.slice(0, -1);
                    } else if (
                        uploadState.type == "attached" &&
                        uploadState.files.length
                    ) {
                        uploadState = {
                            type:
                                uploadState.files.length > 1
                                    ? "attached"
                                    : "none",
                            files: uploadState.files.slice(0, -1),
                        };
                    }
                }

                debounceStopTyping(true);
            }}
            {onFocus}
            {onBlur}
            disabled={uploadState.type == "uploading" ||
                uploadState.type == "sending"}
        />
        <div class={Action}>
            <Flyout offset={24} alignment="end">
                <IconButton>
                    <BxHappyBeaming size={24} />
                </IconButton>
                {#snippet override()}
                                        <Picker
                        {categories}
                        {emojis}
                        onSelect={(emoji) => append(`:${emoji}:`, "mention")}
                        
                    />
                                    {/snippet}
            </Flyout>
        </div>
        <div class={Action}>
            <BxSend
                class="mobile"
                size={20}
                on:click={mock ? mockSend : send}
            />
        </div>
    </div>
{/if}
