<script lang="ts">
    import UserTooltip from "$lib/components/indicators/UserTooltip.svelte";
    import { ItemContainer } from "./Item.svelte";
    import LineDivider from "$lib/components/atoms/LineDivider.svelte";
    import ChannelInner from "$lib/components/channels/ChannelInner.svelte";
    import { PersonPicture } from "fluent-svelte";
    import { useClient } from "$lib/components/client/ClientContext.svelte";
    import { useState } from "$lib/components/state/StateContext.svelte";

    
        //client: Client,
        //active = false,
    const client = useClient();
    let channels = $derived([...client.channels.values()].filter(
        (x) =>
            ((x.type == "DirectMessage" && x.active) ||
                x.type == "Group") && x.unread,
    ));
</script>

<div class={ItemContainer} style="padding-top: 6px;">
    <a href={useState().layout.getLastHomePath()}>
        <UserTooltip user={client.user} div right>
            {#if client.user}
            <PersonPicture src={client.user.animatedAvatarURL} size={42} />
            {/if}
        </UserTooltip>
    </a>
    {#if channels.length}
        <div class="List">
            {#each channels as channel}
                <a href={`/channel/${channel.id}`}>
                    <ChannelInner {channel} />
                </a>
            {/each}
        </div>
    {/if}
    <LineDivider compact />
</div>

<style>
    div.List {
        gap: 12px;
        display: flex;
        margin-top: 8px;
        margin-bottom: 12px;
        flex-direction: column;
    }
</style>