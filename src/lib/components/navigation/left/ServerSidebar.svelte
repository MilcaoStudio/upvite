<script lang="ts">
    import { isTouchscreenDevice } from "$lib";
    import { state } from "$lib/State";
    import ConditionalLink from "$lib/components/atoms/ConditionalLink.svelte";
    import JSXRender from "$lib/components/JSXRender.svelte";
    import { useClient } from "$lib/controllers/ClientController";
    import { css, cx } from "@emotion/css";
    import type { Channel, Server } from "revolt.js";
    import { internalEmit } from "$lib/InternalEmitter";
    import ChannelButton from "../items/ChannelButton.svelte";
    import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";
    import Category from "$lib/components/atoms/Category.svelte";
    import ServerHeader from "$lib/components/servers/ServerHeader.svelte";
    import { createElement, type SvelteElement } from "$lib/markdown/runtime/svelteRuntime";
    import UserPanel from "./UserPanel.svelte";

    export let server: Server, channel: Channel | undefined;
    const ServerBase = cx(
        "ServerBase",
        css`
            height: 100%;
            width: 232px;
            display: flex;
            flex-shrink: 0;
            flex-direction: column;
            background: var(--secondary-background);
            border-start-start-radius: 8px;
            border-end-start-radius: 8px;
            overflow: hidden;

            ${isTouchscreenDevice ? `padding-bottom: 50px;` : ``}
        `,
    );
    const ServerList = cx(
        "ServerList",
        css`
            padding: 6px;
            flex-grow: 1;
            overflow-y: scroll;

            > svg {
                width: 100%;
            }
        `,
    );

    const client = useClient();
    $: channel && state.layout.setLastOpened(server._id, channel._id);
    const uncategorised = new Set(server.channel_ids);
    const elements: SvelteElement[] = [];
    function addChannel(id: string) {
        const entry = client.channels.get(id);
        if (!entry) {
            return;
        }

        const active = channel?._id == entry._id;
        const isUnread = entry.isUnread(state.notifications);
        const mentionCount = entry.getMentions(state.notifications);

        return createElement(
            ConditionalLink,
            {
                onClick: (e: MouseEvent) => {
                    if (e.shiftKey) {
                        internalEmit(
                            "MessageBox",
                            "append",
                            `<#${entry._id}>`,
                            "channel_mention",
                        );
                        e.preventDefault();
                    }
                },
                active,
                href: `/server/${server!._id}/channel/${entry._id}`,
            },
            createElement(ChannelButton, {
                channel: entry,
                active,
                alert:
                    mentionCount.length > 0
                        ? "mention"
                        : isUnread
                          ? "unread"
                          : undefined,
                compact: true,
                muted: state.notifications.isMuted(entry),
            }),
        );
    }
    if (server.categories) {
        for (const category of server.categories) {
            const channels: SvelteElement[] = [];
            for (const id of category.channels) {
                uncategorised.delete(id);
                const channel = addChannel(id);
                channel && channels.push(channel);
            }
            elements.push(
                createElement(
                    CollapsibleSection,
                    {
                        id: category.id,
                        defaultValue: true,
                        summary: createElement(Category, {}, category.title),
                    },
                    ...channels,
                ),
            );
        }
    }

    for (const id of Array.from(uncategorised).reverse()) {
        const channel = addChannel(id);
        channel && elements.unshift(channel);
    }
</script>

<div class={ServerBase}>
    <ServerHeader {server}/>
    <!--<ConnectionStatus />-->
    <div class={ServerList}>
        {#each elements as element}
            <JSXRender node={element} />
        {/each}
    </div>
    <UserPanel {client} />
</div>
