<script lang="ts">
    import { LocalStream, type Constraints } from "$lib/voice/Stream";
    import { voiceState } from "$lib/voice/VoiceState";
    import Row from "$lib/components/atoms/layout/Row.svelte";
    import type { Channel } from "revolt.js";
    import UserIcon from "../user/UserIcon.svelte";
    import { modalController } from "../modals/ModalController";
    import { useClient } from "$lib/controllers/ClientController";

    export let channel: Channel;
    let client = useClient();
    let voiceClient = voiceState.client;
    let localStream: LocalStream | null;
    let localSource: MediaProvider | undefined;
    let localVideo: HTMLVideoElement | null;
    let remoteVideo: HTMLVideoElement | null;
    $: participants = voiceState.participants;

    $: if (localVideo) {
        localVideo.srcObject = localStream;
        localVideo.autoplay = true;
        localVideo.controls = true;
        localVideo.muted = true;
    }
    function requestUserMedia() {
        const constraints = {
            resolution: "hd",
            codec: "vp8",
            audio: true,
            simulcast: true,
        } as Constraints;
        LocalStream.getUserMedia(constraints).then((media) => {
            localStream = media;
            if (localVideo) {
                localSource = media;
            } else {
                console.warn("Local video element not found");
            }
            //voiceClient?.publish(media)
        });
    }
</script>

<Row data-scroll-offset="with_padding">
    <div class="VoiceUi with-padding">
        {#each participants.keys() as id (id)}
            <UserIcon
                target={client.users.get(id)}
                size={48}
                onClick={() =>
                    modalController.push({
                        type: "user_profile",
                        user_id: id,
                        contextualServer: channel.server_id ?? undefined,
                    })}
            />
        {/each}
    </div></Row
>

<style>
    .VoiceUi {
        background-color: black;
        padding: 30px;
    }
    video {
        width: 300px;
        height: 150px;
    }
</style>
