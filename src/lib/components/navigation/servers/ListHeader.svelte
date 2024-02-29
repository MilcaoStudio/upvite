<script lang="ts">
    import UserTooltip from "$lib/components/indicators/UserTooltip.svelte";
    import type { Client } from "revolt.js";
    import { ItemContainer } from "./Item.svelte";
    import LineDivider from "$lib/components/atoms/LineDivider.svelte";
    import ChannelInner from "$lib/components/channels/ChannelInner.svelte";
    import type { INotificationChecker } from "revolt.js/dist/util/Unreads";
    import { PersonPicture } from "fluent-svelte";

    export let client: Client,
        //active = false,
        home: () => string,
        permit: INotificationChecker;
    $: channels = [...client.channels.values()].filter(
        (x) =>
            ((x.channel_type == "DirectMessage" && x.active) ||
                x.channel_type == "Group") && x.unread,
    );
</script>

<div class={ItemContainer} style="padding-top: 6px;">
    <a href={home()}>
        <UserTooltip user={client.user} div right>
            {#if client.user}
            <PersonPicture src={client.user.generateAvatarURL(
                {
                    max_side: 256,
                },
                false,
            )} size={42} />
            {/if}
        </UserTooltip>
    </a>
    {#if channels.length}
        <div class="List">
            {#each channels as channel}
                <a href={`/channel/${channel._id}`}>
                    <ChannelInner {channel} {permit} />
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