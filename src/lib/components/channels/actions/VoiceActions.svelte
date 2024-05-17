<script lang="ts">
    import IconButton from "$lib/components/atoms/input/IconButton.svelte";
    import PhoneCall from "svelte-boxicons/BxPhoneCall.svelte";
    import PhoneOff from "svelte-boxicons/BxPhoneOff.svelte";
    import { VoiceStatus, voiceState } from "$lib/voice/VoiceState";
    import type { Channel } from "revolt.js";
    import { autorun } from "mobx";

    export let channel: Channel;
    let roomId: string | null = null;
    $: autorun(()=> roomId = voiceState.roomId)
</script>

{#if voiceState.status >= VoiceStatus.READY}
    {#if roomId == channel._id}
        <IconButton onClick={voiceState.disconnect}>
            <PhoneOff size={22} />
        </IconButton>
    {:else}
        <IconButton
            onClick={async () => {
                await voiceState.loadVoice();
                voiceState.disconnect();
                voiceState.connect(channel);
            }}
        >
            <PhoneCall size={24} />
        </IconButton>
    {/if}
{:else}
    <IconButton>
        <PhoneCall size={24} color="red" />
    </IconButton>
{/if}
