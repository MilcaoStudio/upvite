<script lang="ts">
    import { run } from 'svelte/legacy';

    import IconButton from "$lib/components/atoms/input/IconButton.svelte";
    import PhoneCall from "svelte-boxicons/BxPhoneCall.svelte";
    import PhoneOff from "svelte-boxicons/BxPhoneOff.svelte";
    import { VoiceStatus, voiceState } from "$lib/voice/VoiceState";
    import type { Channel } from "stoat.js";
    import { autorun } from "mobx";
    import { internalEmit } from "$lib/InternalEmitter";

    interface Props {
        channel: Channel;
    }

    let { channel }: Props = $props();
    let linkedRoom: string | null = $state(null);
    let status = voiceState.status;
    run(() => {
        autorun(()=> linkedRoom = voiceState.roomId)
    });
</script>

{#if $status >= VoiceStatus.RTC_CONNECTING}
    {#if linkedRoom == channel.id}
        <IconButton onClick={()=> {
            internalEmit("voice", "leave");
        }}>
            <PhoneOff size={22} color="red" />
        </IconButton>
    {:else}
        <IconButton
            onClick={async () => {
                voiceState.leave();
                internalEmit("voice", "join")
            }}
        >
            <PhoneCall size={24} />
        </IconButton>
    {/if}
{:else}
    <IconButton onClick={async () => {
        internalEmit("voice", "join");
    }}>
        <PhoneCall size={24} />
    </IconButton>
{/if}