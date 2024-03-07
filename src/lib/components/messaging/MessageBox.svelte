<script lang="ts">
    import TextSvelte from "$lib/i18n/TextSvelte.svelte";
    import { dayjs } from "../context/Locale.svelte";
    import { _ } from "svelte-i18n";
    import {
        clientController,
        useClient,
    } from "$lib/controllers/ClientController";
    import { BxHappyBeaming, BxSend, BxShieldX } from "svelte-boxicons";
    import type { DraftObject } from "$lib/stores/Draft";
    import { state } from "$lib/State";
    import { internalEmit, internalSubscribe } from "$lib/InternalEmitter";
    import { ulid } from "ulid";
    import type { Reply } from "$lib/stores/MessageQueue";
    import TextAreaAutoSize from "../atoms/TextAreaAutoSize.svelte";
    import type { Channel } from "revolt.js";
    import type {
        EmojiCategory,
        EmojiInfo,
        UploadState,
    } from "$lib/types/messaging";
    import { css, cx } from "@emotion/css";
    import {
        SMOOTH_SCROLL_ON_RECEIVE,
        getRenderer,
    } from "$lib/rendered/Singleton";
    import { defer, isTouchscreenDevice, takeError } from "$lib";
    import Autocomplete, { useAutoComplete } from "../Autocomplete.svelte";
    import PermissionTooltip from "../atoms/PermissionTooltip.svelte";
    import { Flyout } from "fluent-svelte";
    import IconButton from "../atoms/input/IconButton.svelte";
    import Picker from "../atoms/media/Picker.svelte";
    import { RevoltEmojiDictionary } from "revkit";
    import { autorun } from "mobx";

    export let channel: Channel;
    const client = useClient();
    let uploadState: UploadState = { type: "none" };
    let replies: Reply[] = [];
    let typing = 0;

    let value = "";
    $: autorun(()=>{
        value = state.draft.get(channel._id)?.content ?? "";
    });
    const Base = cx(
        "MessageBox",
        css`
            z-index: 1;
            display: flex;
            align-items: center;
            background: var(--secondary-header);
            gap: 12px;
            padding: 0px 12px 0px 12px;
            margin: 0px 6px 6px 6px;
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

            ${!isTouchscreenDevice ? `.mobile { display: none; }` : ``}
        `,
    );

    // For sed replacement
    const RE_SED = new RegExp("^s/([^])*/([^])*$");
    // Tests for code block delimiters (``` at start of line)
    const RE_CODE_DELIMITER = new RegExp("^```", "gm");

    const renderer = getRenderer(channel);

    function startTyping() {
        if (typeof typing == "number" && +new Date() < typing) return;

        const ws = client.websocket;
        if (ws.connected) {
            typing = +new Date() + 2500;
            ws.send({
                type: "BeginTyping",
                channel: channel._id,
            });
        }
    }

    function stopTyping(force?: boolean) {
        if (force || typing) {
            const ws = client.websocket;
            if (ws.connected) {
                typing = 0;
                ws.send({
                    type: "EndTyping",
                    channel: channel._id,
                });
            }
        }
    }

    let setMessage = function (content?: string) {
        const dobj: DraftObject = { content };
        state.draft.set(channel._id, dobj);
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

        if (!state.draft.has(channel._id)) {
            setMessage(text);
        } else {
            setMessage(`${state.draft.get(channel._id)?.content} ${text}`);
        }
    }

    internalSubscribe(
        "MessageBox",
        "append",
        append as (...args: unknown[]) => void,
    );

    /**
     * Trigger send message.
     */
    async function send() {
        if (uploadState.type == "uploading" || uploadState.type == "sending")
            return;
        const content = state.draft.get(channel._id)?.content?.trim() ?? "";
        if (!content.length) return;
        internalEmit("NewMessages", "hide");
        stopTyping();
        setMessage();
        replies = [];
        const nonce = ulid();

        // sed style message editing.
        // If the user types for example `s/abc/def`, the string "abc"
        // will be replaced with "def" in their last sent message.
        if (RE_SED.test(content)) {
            renderer.messages.reverse();
            const msg = renderer.messages.find(
                (msg) => msg.author_id == client.user!._id,
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
                        msg.delete().catch(console.error);
                    } else {
                        msg.edit({
                            content: newContent.slice(0, 2000),
                        })
                            .then(() =>
                                defer(() =>
                                    renderer.jumpToBottom(
                                        SMOOTH_SCROLL_ON_RECEIVE,
                                    ),
                                ),
                            )
                            .catch(console.error);
                    }
                }
            }
        } else {
            //state.settings.sounds.playSound("outbound");

            state.queue.add(nonce, channel._id, {
                _id: nonce,
                channel: channel._id,
                author: client.user!._id,

                content,
                replies,
            });

            defer(() => renderer.jumpToBottom(SMOOTH_SCROLL_ON_RECEIVE));

            try {
                await channel.sendMessage({
                    content,
                    nonce,
                    replies,
                });
            } catch (error) {
                state.queue.fail(nonce, takeError(error));
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
        users: { type: "channel", id: channel._id },
        channels:
            channel.channel_type == "TextChannel"
                ? { server: channel.server_id! }
                : undefined,
    });

    let emojis: Record<string, EmojiInfo[]> = {
        default: Object.keys(RevoltEmojiDictionary).map((id) => ({ id })),
    };
    let categories: EmojiCategory[] = [];
    $: autorun(() => {
        categories = [];
        for (const server of state.ordering.orderedServers) {
            // ! FIXME: add a separate map on each server for emoji
            const list = [...clientController.readyClient!.emojis.values()]
                .filter(
                    (emoji) =>
                        emoji.parent.type != "Detached" &&
                        emoji.parent.id == server._id,
                )
                .map(({ _id, name }) => ({ id: _id, name }));

            if (list.length) {
                emojis[server._id] = list;
                categories.push({
                    id: server._id,
                    name: server.name,
                    iconURL: server.generateIconURL({ max_side: 256 }),
                });
            }
        }
        categories.push({
            id: "default",
            name: "Default",
            emoji: "smiley",
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
{:else if !channel.havePermission("SendMessage")}
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
    <div class={Base}>
        <TextAreaAutoSize
            maxRows={20}
            id="message"
            maxlength="2000"
            minHeight={60}
            {value}
            onChange={(e) => {
                setMessage(e.currentTarget.value);
                startTyping();
                onChange(e);
            }}
            {onKeyUp}
            onKeyDown={(e) => {
                if (e.ctrlKey && e.key == "Enter") {
                    e.preventDefault();
                    return send();
                }


            if (onKeyDown(e)) return;

            if (
                !e.shiftKey &&
                !e.isComposing &&
                e.key == "Enter" &&
                !isTouchscreenDevice
            ) {
                e.preventDefault();
                return send();
            }
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
            <Picker
                {categories}
                {emojis}
                onSelect={(emoji) => append(`:${emoji}:`, "mention")}
                slot="override"
            />
        </Flyout>
    </div>
    <div class={Action}>
        <BxSend size={20} on:click={send} />
    </div>
</div>
{/if}
