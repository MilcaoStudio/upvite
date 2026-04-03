<script lang="ts">
    import type { Channel, User } from "stoat.js";
    import BxAt from "svelte-boxicons/BxAt.svelte";
    import BxHash from "svelte-boxicons/BxHash.svelte";
    import PageHeader from "../atoms/PageHeader.svelte";
    import ChannelName from "./ChannelName.svelte";
    import { isTouchscreenDevice } from "$lib";
    import { useStatusColor } from "../user/UserIcon.svelte";
    import { modalController } from "../modals/ModalController";
    import HeaderActions from "./actions/HeaderActions.svelte";
    import Markdown from "$lib/markdown/Markdown.svelte";
    import BxPhoneCall from "svelte-boxicons/BxPhoneCall.svelte";
    import BxNotepad from "svelte-boxicons/BxNotepad.svelte";
    import { t } from "svelte-i18n";
    import VoiceUi from "./VoiceUI.svelte";

    interface Props {
        channel: Channel;
    }

    let { channel }: Props = $props();
    let recipient: User | null = null;
    let icon = $derived.by(()=>{
        switch (channel.type) {
            case "TextChannel":
                return channel.isVoice ? BxPhoneCall : BxHash;
            // case "DirectMessage":
            // case "Group":
            case "SavedMessages":
                return BxNotepad;
            default:
                return BxAt;
        }
    });
    $effect(()=>{
        document.title = (channel.type == "SavedMessages" ? $t('app.navigation.tabs.saved') : channel.server ? `#${channel.name} - ${channel.server.name}` : channel.recipient ? `${channel.recipient.username}` : `${channel.name}`) + " | Uprising";
    });
</script>

<PageHeader {icon} withTransparency>
    <div class="Info">
        <span class="name">
            <ChannelName {channel} />
        </span>
        {#if isTouchscreenDevice() && channel.type == "DirectMessage"}
            <div class="divider"></div>
            <span class="desc">
                <div class="status" style:background-color={useStatusColor(recipient)}>
                    <!-- <UserStatus user={recipient} />-->
                </div>
            </span>
        {/if}
        {#if !isTouchscreenDevice() && (channel.type == "Group" || channel.type == "TextChannel") && channel.description}
            <div class="divider"></div>
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <span class="desc" role="complementary" onclick={()=>modalController.push({type: "channel_info", channel})} onkeydown={()=>modalController.push({type: "channel_info", channel})}>
                <!--Markdown here-->
                <Markdown content={channel.description} />
            </span>
        {/if}
    </div>
    <HeaderActions {channel} />
</PageHeader>
{#if channel.isVoice}
    <VoiceUi {channel} />
{/if}

<style>
    div.Info {
        flex-grow: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;

    display: flex;
    gap: 8px;
    align-items: center;

    }

    div.Info * {
        display: inline-block;
    }

    div.Info .divider {
        height: 20px;
        margin: 0 5px;
        padding-left: 1px;
        background-color: var(--tertiary-background);
    }

    div.Info .status {
        width: 10px;
        height: 10px;
        display: inline-block;
        margin-inline-end: 6px;
        border-radius: var(--border-radius-half);
    }

    div.Info .desc {
        cursor: pointer;
        margin-top: 2px;
        font-size: 0.8em;
        font-weight: 400;
        color: var(--secondary-foreground);
    }

    .desc > :global(*) {
        pointer-events: none;
    }
</style>