<script lang="ts">
    import { LocalStream, type Constraints } from "$lib/voice/Stream";
    import { VoiceStatus, voiceState } from "$lib/voice/VoiceState";
    import Row from "$lib/components/atoms/layout/Row.svelte";
    import type { Channel } from "revolt.js";
    import UserIcon from "../user/UserIcon.svelte";
    import { modalController } from "../modals/ModalController";
    import { useClient } from "$lib/controllers/ClientController";
    import { internalSubscribe } from "$lib/InternalEmitter";
    import { autorun } from "mobx";
    import VideoStream from "./VideoStream.svelte";
    import IconButton from "../atoms/input/IconButton.svelte";
    import BxVideo from "svelte-boxicons/BxVideo.svelte";
    import BxVideoOff from "svelte-boxicons/BxVideoOff.svelte";
    import BxMicrophone from "svelte-boxicons/BxMicrophone.svelte";
    import BxMicrophoneOff from "svelte-boxicons/BxMicrophoneOff.svelte";
    import { readable } from "svelte/store";

    export let channel: Channel;
    let client = useClient();
    $: user = client.user;
    let localStream: LocalStream | null;
    let localVideo: HTMLVideoElement | null;
    $: participants = voiceState.participants;

    let video = false;
    let simulcast = false;
    let audio = true;
    let resolution = "hd";
    let streams: MediaStream[] | undefined;
    $: autorun(() => {
        streams = [...voiceState.streams.values()];
    });

    $: if (localVideo) {
        localVideo.srcObject = localStream;
        localVideo.controls = false;
    }
    $: status = voiceState.status;
    $: internalSubscribe("voice", "join", init);
    $: internalSubscribe("voice", "leave", removeTracks);

    function removeTracks() {
        console.debug("removeTracks");
        localStream?.getTracks().forEach((track) => track.stop());
        localStream = null;
        voiceState.leave();
    }

    function init() {
        if (!voiceState.client?.supported()) {
            return;
        }
        requestUserMedia().then((media) => voiceState.init(media, channel._id));
    }

    async function requestUserMedia() {
        const constraints = {
            video,
            codec: "vp8",
            resolution,
            audio,
        } as Constraints;
        const media = await LocalStream.getUserMedia(constraints);
        localStream = media;
        return media;
    }
</script>

{#if $status == VoiceStatus.CONNECTED}
    <div class="VoiceUi with-padding">
        <Row centred gap="8px">
            {#if user}
                {#if localStream}
                    <VideoStream srcObject={localStream} {video} />
                {/if}
            {/if}
            {#if streams}
                {#each streams as stream}
                    <VideoStream srcObject={stream} {video} />
                {/each}
            {/if}
        </Row>
        <Row centred gap="8px">
            <IconButton
                onClick={() => {
                    if (audio) {
                        localStream?.mute("audio");
                        audio = false;
                    } else {
                        localStream?.unmute("audio");
                        audio = true;
                    }
                }}
            >
                {#if audio}
                    <BxMicrophoneOff size={30} />
                {:else}
                    <BxMicrophone size={30} />
                {/if}
            </IconButton>
            <IconButton
                onClick={() => {
                    if (video) {
                        video = false;
                        localStream?.mute("video");
                    } else {
                        video = true;
                        requestUserMedia();
                    }
                }}
            >
                {#if video}
                    <BxVideoOff size={30} />
                {:else}
                    <BxVideo size={30} />
                {/if}
            </IconButton>
        </Row>
    </div>
{:else if $status == VoiceStatus.UNAVAILABLE}
    <div class="with-padding">
        <div class="error">
            <h4>Voice service is unavailable.</h4>
        </div>
    </div>
{/if}

<style>
    .VoiceUi {
        background-color: black;
        padding-bottom: 20px;
    }
    .with-padding {
        padding-top: 40px;
    }
    .error {
        background-color: var(--error);
        text-align: center;
    }
</style>
