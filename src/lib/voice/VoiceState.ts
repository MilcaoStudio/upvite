import { ObservableMap, action, makeAutoObservable, runInAction } from "mobx";
import { Client } from "revolt.js";

import type { ProduceType, VoiceUser } from "../types/Voice";
import type VoiceClient from "./VoiceClient";
import type { LocalStream, RemoteStream } from "./Stream";
import { get, writable, type Writable } from "svelte/store";
import { injectWindow } from "$lib";

export enum VoiceStatus {
    UNAVAILABLE,
    UNLOADED,
    ERRORED,
    LOADING,
    CONNECTING,
    AUTHENTICATING,
    READY,
    RTC_CONNECTING,
    CONNECTED,
    // RECONNECTING
}

// This is an example of how to implement MobX state.
// * Note for better implementation:
// * MobX state should be implemented on the VoiceClient itself.
class VoiceStateReference {
    client?: VoiceClient;
    connecting?: boolean;

    status: Writable<VoiceStatus>;
    roomId: string | undefined;
    participants: Map<string, VoiceUser>;
    streams: ObservableMap<string, RemoteStream>;

    constructor() {
        this.status = writable(VoiceStatus.UNLOADED);
        this.participants = new Map();
        this.streams = new ObservableMap;

        this.syncState = this.syncState.bind(this);
        this.init = this.init.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.leave = this.leave.bind(this);

        makeAutoObservable(this, {
            client: false,
            connecting: false,
        });
    }

    // This takes information from the voice
    // client and applies it to the state here.
    @action syncState() {
        if (!this.client) return;
        this.roomId = this.client.roomId;
        this.participants.clear();
        this.client.participants.forEach((v, k) => this.participants.set(k, v));
    }

    // This imports and constructs the voice client.
    @action async loadVoice(apiClient: Client) {
        this.status.set(VoiceStatus.LOADING);

        const userId = apiClient.user?.id ?? "guest";
        try {
            const { default: VoiceClient } = await import("./VoiceClient");
            const client = new VoiceClient();

            client.on("ready", this.syncState);
            client.on("startProduce", this.syncState);
            client.on("stopProduce", this.syncState);
            client.on("userJoined", this.syncState);
            client.on("userLeft", this.syncState);
            client.on("userStartProduce", this.syncState);
            client.on("userStopProduce", this.syncState);

            this.status.set(VoiceStatus.CONNECTING);
            const voiceURL = apiClient.configuration?.features.voso.url ?? "localhost:4000";
            await client.connect(voiceURL);
            this.client = client;
            this.status.set(VoiceStatus.AUTHENTICATING);
            await client.authenticate(userId);
            runInAction(() => {
                if (!client.supported()) {
                    this.status.set(VoiceStatus.UNAVAILABLE);
                } else {
                    this.status.set(VoiceStatus.READY);
                }
            });
        } catch (err) {
            console.error("Failed to load voice library!", err);
            runInAction(() => {
                this.status.set(VoiceStatus.UNAVAILABLE);
            });
        }
    }

    /**
     * Initialize transports
     */
    @action async init(local: LocalStream, target: string) {
        if (!this.client?.supported()) {
            this.status.set(VoiceStatus.UNAVAILABLE);
            return;
        }

        this.connecting = true;
        this.status.set(VoiceStatus.RTC_CONNECTING);
        
        await this.client.join(target, local);
        this.status.set(VoiceStatus.CONNECTED);
    }

    @action leave() {
        if (!this.client?.supported()) {
            return;
        }
        this.connecting = false;
        this.streams.clear();
        this.client?.leave();
        
        this.syncState();
        this.status.set(VoiceStatus.UNLOADED);
    }
    // Disconnect from current channel.
    @action disconnect() {
        this.connecting = false;

        this.client?.disconnect();
        this.syncState();
        this.status.set(VoiceStatus.UNLOADED);
    }

    isProducing(type: ProduceType) {
        return false;
        /*
        switch (type) {
            case "audio":
                return this.client?.audioProducer !== undefined;
        }*/
    }

    isDeaf() {
        if (!this.client) return false;

        return this.client.isDeaf;
    }

    async startDeafen() {
        if (!this.client) return console.log("No client object"); // ! TODO: let the user know
        if (this.client.isDeaf) return;

        this.client.isDeaf = true;
        /*
        this.client?.consumers.forEach((consumer) => {
            consumer.audio?.pause();
        });*/

        this.syncState();
    }
    async stopDeafen() {
        if (!this.client) return console.log("No client object"); // ! TODO: let the user know
        if (!this.client.isDeaf) return;

        this.client.isDeaf = false;
        /*
        this.client?.consumers.forEach((consumer) => {
            consumer.audio?.resume();
        });*/

        this.syncState();
    }

    async startProducing(type: ProduceType) {
        /*
        switch (type) {
            case "audio": {
                if (this.client?.audioProducer !== undefined)
                    return console.log("No audio producer."); // ! TODO: let the user know

                if (navigator.mediaDevices === undefined)
                    return console.log("No media devices."); // ! TODO: let the user know

                const mediaDevice =
                    window.localStorage.getItem("audioInputDevice");

                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: mediaDevice ? { deviceId: mediaDevice } : true,
                });

                await this.client?.startProduce(
                    mediaStream.getAudioTracks()[0],
                    "audio",
                );
            }
        }*/

        this.syncState();
    }

    async stopProducing(type: ProduceType) {
        await this.client?.stopProduce(type);

        this.syncState();
    }
}

export const voiceState = new VoiceStateReference();
injectWindow("voiceState", voiceState);