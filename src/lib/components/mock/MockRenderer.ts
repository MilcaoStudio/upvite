import { ChannelRenderer, SMOOTH_SCROLL_ON_RECEIVE } from "$lib/rendered/Singleton.svelte";
import type { RendererRoutines, ScrollState } from "$lib/rendered/types";
import type { Channel, Message } from "stoat.js";
import { mockFetchMessagesWithUsers } from "./MockClient";
import { runInAction } from "mobx";

const MAX_MESSAGES = 200;
export const MockRenderer: RendererRoutines = {
    init: async function (renderer, nearby, smooth) {
        if (nearby) {
            mockFetchMessagesWithUsers(renderer.channel, {limit: renderer.limit}).then(({ messages }) => {
                messages.sort((a, b) => a.id.localeCompare(b.id));

                runInAction(() => {
                    renderer.state = "RENDER";
                    renderer.messages = messages;
                    renderer.atTop = false;
                    renderer.atBottom = false;

                    renderer.emitScroll({
                        type: "ScrollToView",
                        id: nearby,
                    });
                });
            });
        } else {
            mockFetchMessagesWithUsers(renderer.channel, {limit: renderer.limit}).then(({ messages }) => {
                messages.reverse();

                runInAction(() => {
                    renderer.state = "RENDER";
                    renderer.messages = messages;
                    renderer.atTop = messages.length < 50;
                    renderer.atBottom = true;

                    renderer.emitScroll({
                        type: "ScrollToBottom",
                        smooth,
                    });
                });
            });
        }
    },
    receive: async function (renderer, message) {
        if (message.channel_id != renderer.channel.id) return;
        if (renderer.state != "RENDER") return;
        if (renderer.messages.find((x) => x.id == message._id)) return;
        if (!renderer.atBottom) return;
        let messages = [...renderer.messages, message];
        let atTop = renderer.atTop;
        if (messages.length > MAX_MESSAGES) {
            messages = messages.slice(messages.length - MAX_MESSAGES);
            atTop = false;
        }
        runInAction(() => {
            renderer.messages = messages;
            renderer.atTop = atTop;

            renderer.emitScroll({
                type: "StayAtBottom",
                smooth: SMOOTH_SCROLL_ON_RECEIVE,
            });
        });

    },
    updated: async function (renderer) {
        renderer.emitScroll({
            type: "StayAtBottom",
            smooth: false,
        });
    },
    delete: async function (renderer, id) {
        if (!renderer.channel) return;
        if (renderer.state != "RENDER") return;

        const index = renderer.messages.findIndex((x) => x.id == id);

        if (index > -1) {
            runInAction(() => {
                renderer.messages.splice(index, 1);
                renderer.emitScroll({ type: "StayAtBottom" });
            });
        }
    },
    loadTop: async function (renderer, generateScroll) {
        const channel = renderer.channel;
        if (!channel) return true;

        if (renderer.state !== "RENDER") return true;
        if (renderer.atTop) return true;

        const { messages: data } =
            await mockFetchMessagesWithUsers(channel, {
                before: renderer.messages[0].id,
                limit: renderer.limit,
            });

        runInAction(() => {
            if (!data.length) {
                renderer.atTop = true;
                return;
            }

            data.reverse();
            renderer.messages = [...data, ...renderer.messages];

            if (data.length < renderer.limit) {
                renderer.atTop = true;
            }

            if (renderer.messages.length > MAX_MESSAGES) {
                renderer.messages = renderer.messages.slice(0, MAX_MESSAGES);
                renderer.atBottom = false;
            }

            renderer.emitScroll(
                generateScroll(
                    renderer.messages[renderer.messages.length - 1].id,
                ),
            );
        });
    },
    loadBottom: async function (renderer, generateScroll) {
        const channel = renderer.channel;
        if (!channel) return true;

        if (renderer.state != "RENDER") return true;
        if (renderer.atBottom) return true;

        const { messages: data } =
            await mockFetchMessagesWithUsers(channel, {
                after: renderer.messages[renderer.messages.length - 1].id,
                sort: "Oldest",
            });

        runInAction(() => {
            if (!data.length) {
                renderer.atBottom = true;
                return;
            }

            renderer.messages.splice(renderer.messages.length, 0, ...data);

            if (data.length < 50) {
                renderer.atBottom = true;
            }

            if (renderer.messages.length > MAX_MESSAGES) {
                renderer.messages.splice(0, renderer.messages.length - MAX_MESSAGES);
                renderer.atTop = false;
            }

            renderer.emitScroll(generateScroll(renderer.messages[0].id));
        });
    }
}
const renderers: Record<string, ChannelRenderer> = {};
export function getRenderer(channel: Channel) {
    let renderer = renderers[channel.id];
    if (!renderer) {
        renderer = new ChannelRenderer(channel);
        renderer.currentRenderer = MockRenderer;
        renderers[channel.id] = renderer;
    }

    return renderer;
}