<script lang="ts">
    import { run } from 'svelte/legacy';

    import { state } from "$lib/State";
    import ConditionalLink from "$lib/components/atoms/ConditionalLink.svelte";
    import JSXRender from "$lib/components/JSXRender.svelte";
    import { css, cx } from "@emotion/css";
    import type { Client, Channel, Server } from "stoat.js";
    import { internalEmit } from "$lib/InternalEmitter";
    import ChannelButton from "../items/ChannelButton.svelte";
    import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";
    import Category from "$lib/components/atoms/Category.svelte";
    import ServerHeader from "$lib/components/servers/ServerHeader.svelte";
    import ContextMenu from "$lib/components/context/ContextMenu.svelte";
    import {
        createElement,
        type SvelteElement,
    } from "$lib/markdown/runtime/svelteRuntime";
    import UserPanel from "./UserPanel.svelte";
    import { autorun } from "mobx";
    import { notificationsStore } from "$lib/stores/NotificationOptions";

    interface Props {
        server: Server;
        channel: Channel | undefined;
        client: Client;
    }

    let { server, channel, client }: Props = $props();
    const ServerBase = cx(
        "ServerBase",
        css`
            width: 232px;
            display: flex;
            flex-shrink: 0;
            flex-direction: column;
            background: var(--secondary-background);
            border-radius: var(--border-radius-inner);
            margin: 6px 0px 6px 0px;
            overflow: hidden;
            position: relative;
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

    run(() => {
        channel && state.layout.setLastOpened(server.id, channel.id);
    });
    let uncategorised = new Set<string>();
    let elements: SvelteElement[] = $state([]);
    autorun(() => {
        uncategorised = new Set(server.channelIds);
        elements = [];
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
                            summary: createElement(
                                Category,
                                {},
                                category.title,
                            ),
                        },
                        ...channels,
                    ),
                );
            }
        }
        for (const id of Array.from(uncategorised).reverse()) {
            const channelElement = addChannel(id);
            channelElement && elements.unshift(channelElement);
        }
    });

    function addChannel(id: string) {
        const entry = client.channels.get(id);
        if (!entry) {
            return;
        }

        const active = channel?.id == entry.id;
        const isUnread = entry.unread;
        const mentionCount = entry.mentions?.size || 0;

        return createElement(
            ConditionalLink,
            {
                onClick: (e: MouseEvent) => {
                    if (e.shiftKey) {
                        internalEmit(
                            "MessageBox",
                            "append",
                            `<#${entry.id}>`,
                            "channel_mention",
                        );
                        e.preventDefault();
                    }
                },
                active,
                href: `/server/${server!.id}/channel/${entry.id}`,
            },
            createElement(ChannelButton, {
                channel: entry,
                active,
                alert:
                    mentionCount > 0
                        ? "mention"
                        : isUnread
                          ? "unread"
                          : undefined,
                compact: true,
                muted: notificationsStore.isMuted(entry),
            }),
        );
    }
</script>

<div class={ServerBase}>
    <ServerHeader {server} />
    <!--<ConnectionStatus />-->
    <ContextMenu data={{ server_list: server.id }}>
        <div class={ServerList}>
            {#each elements as element}
                <JSXRender node={element} />
            {/each}
        </div>
    </ContextMenu>
    <UserPanel />
</div>
