<script lang="ts">
    import { useClient } from "$lib/controllers/ClientController";
    import { routeInformation } from "../context/history";
    import { goto } from "$app/navigation";
    import { state } from "$lib/State";
    import ChannelButton from "./ChannelButton.svelte";
    import { isTouchscreenDevice } from "$lib";
    import { css, cx } from "@emotion/css";
    import ServerHeader from "../servers/ServerHeader.svelte";

    const client = useClient();
    let server_id = routeInformation.getServer();
    const server = server_id ? client.servers.get(server_id): undefined;
    if (!server) {
        goto('/')
    }
    let channel_id = routeInformation.getChannel();
    const channel = channel_id ? client.channels.get(channel_id) : undefined;
    $: server_id && channel_id && state.layout.setLastOpened(server_id, channel_id);
    const uncategorised = new Set(server ? server.channel_ids : null);

    const ServerBase = cx('ServerBase', css`
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
    `);
    const ServerList = cx('ServerList',`
        padding: 6px;
        flex-grow: 1;
        overflow-y: scroll;

        > svg {
            width: 100%;
        }
    `);
</script>

{#if server}
<div class={ServerBase}>
    <ServerHeader {server} />
    <div class={ServerList}>
        {#if server.categories}
            {#each server.categories as category}
                {#each category.channels as id}
                    {uncategorised.delete(id)}
                    <a href={`/server/${server._id}/channel/${id}`}>
                        <ChannelButton active channel={client.channels.get(id)} compact muted={state.notifications.isMuted(client.channels.get(id))} />
                    </a>
                {/each}
            {/each}
        {/if}
    </div>
</div>
{/if}
