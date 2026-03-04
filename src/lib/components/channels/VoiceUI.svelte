<script lang="ts">
    import { run } from 'svelte/legacy';

    import { LocalStream, type Constraints } from "$lib/voice/Stream";
    import { VoiceStatus, voiceState } from "$lib/voice/VoiceState";
    import Row from "$lib/components/atoms/layout/Row.svelte";
    import type { Channel } from "stoat.js";
    import { useClient } from "$lib/controllers/ClientController";
    import { internalSubscribe } from "$lib/InternalEmitter";
    import { autorun } from "mobx";
    import VideoStream from "./VideoStream.svelte";
    import IconButton from "../atoms/input/IconButton.svelte";
    import BxVideo from "svelte-boxicons/BxVideo.svelte";
    import BxVideoOff from "svelte-boxicons/BxVideoOff.svelte";
    import BxMicrophone from "svelte-boxicons/BxMicrophone.svelte";
    import BxMicrophoneOff from "svelte-boxicons/BxMicrophoneOff.svelte";

    interface Props {
        channel: Channel;
    }

    let { channel }: Props = $props();
    let client = useClient();
    let localStream: LocalStream | null = $state();
    let localVideo: HTMLVideoElement | undefined = $state();

    let video = $state(false);
    let simulcast = false;
    let audio = $state(true);
    let resolution = "hd";
    let streams: MediaStream[] | undefined = $state();


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
        requestUserMedia().then((media) => voiceState.init(media, channel.id));
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
    let user = $derived(client.user);
    let participants = $derived(voiceState.participants);
    run(() => {
        autorun(() => {
            streams = [...voiceState.streams.values()];
        });
    });
    run(() => {
        if (localVideo) {
            localVideo.srcObject = localStream;
            localVideo.controls = false;
        }
    });
    let status = $derived(voiceState.status);
    run(() => {
        internalSubscribe("voice", "join", init);
    });
    run(() => {
        internalSubscribe("voice", "leave", removeTracks);
    });
</script>

{#if $status == VoiceStatus.CONNECTED}
    <div class="VoiceUi with-padding">
        <Row centred gap="8px">
            {#if user}
                {#if localStream}
                    <VideoStream srcObject={localStream} {video} muted />
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
