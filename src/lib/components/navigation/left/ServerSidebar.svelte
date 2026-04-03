<script lang="ts">
    import ConditionalLink from "$lib/components/atoms/ConditionalLink.svelte";
    import { css, cx } from "@emotion/css";
    import type { Client, Channel, Server } from "stoat.js";
    import type { Category } from "stoat-api";
    import { internalEmit } from "$lib/InternalEmitter";
    import ChannelButton from "../items/ChannelButton.svelte";
    import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";
    import ServerHeader from "$lib/components/servers/ServerHeader.svelte";
    import ContextMenu from "$lib/components/context/ContextMenu.svelte";
    import UserPanel from "./UserPanel.svelte";
    import { useState } from "$lib/components/state/StateContext.svelte";
    import { SvelteSet } from "svelte/reactivity";

    interface Props {
        server: Server;
        channel: Channel | undefined;
        client: Client;
    }

    let { server, channel: currentChannel, client }: Props = $props();
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

    let { layout, notifications } = useState();
    $effect(() => {
        currentChannel && layout.setLastOpened(server.id, currentChannel.id);
    });
    let uncategorised = $derived(new SvelteSet(server.channelIds));
    $effect.pre(() => {
        if (server.categories) {
            for (const category of server.categories) {
                for (const id of category.channels) {
                    uncategorised.delete(id);
                }
            }
        }
    });
</script>

{#snippet ChannelItem(channel?: Channel)}
    {#if channel}
        {@const active = channel.id == currentChannel?.id}
        {@const isUnread = channel.unread}
        {@const mentionCount = channel.mentions?.size || 0}
        <ConditionalLink
            href="/server/{server.id}/channel/{channel.id}"
            {active}
            onclick={(e) => {
                if (e.shiftKey) {
                    internalEmit(
                        "MessageBox",
                        "append",
                        `<#${channel.id}>`,
                        "channel_mention",
                    );
                    e.preventDefault();
                }
            }}
        >
            <ChannelButton
                {channel}
                {active}
                compact
                alert={mentionCount > 0
                    ? "mention"
                    : isUnread
                      ? "unread"
                      : undefined}
                muted={notifications.isMuted(channel)}
            />
        </ConditionalLink>
    {/if}
{/snippet}

{#snippet ChannelCategory(category: Category)}
    <CollapsibleSection id={category.id} defaultValue>
        {#snippet summary()}
            {category.title}
        {/snippet}
        {#each category.channels as channelId}
            {@const channel = client.channels.get(channelId)}
            {@render ChannelItem(channel)}
        {/each}
    </CollapsibleSection>
{/snippet}

<div class={ServerBase}>
    <ServerHeader {server} />
    <ContextMenu data={{ server_list: server.id }}>
        <div class={ServerList}>
            {#each uncategorised as channelId}
                {@const channel = client.channels.get(channelId)}
                {@render ChannelItem(channel)}
            {/each}
            {#each server.categories as category (category.id)}
                {@render ChannelCategory(category)}
            {/each}
        </div>
    </ContextMenu>
    <UserPanel />
</div>
