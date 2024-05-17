import EventEmitter from "eventemitter3";

import {
    type ProduceType,
    WSEventType,
    type VoiceError,
    type VoiceUser,
    type ConsumerList,
    WSErrorCode,
    Role,
    type Transports,
    type Trickle,
} from "../types/Voice";
import { state } from "$lib/State";
import Signaling from "./Signaling";
import { clientController } from "$lib/controllers/ClientController";
import { makeRemote, type RemoteStream } from "./Stream";
import { voiceState } from "./VoiceState";

interface VoiceEvents {
    ready: () => void;
    error: (error: Error) => void;
    close: (error?: VoiceError) => void;

    startProduce: (type: ProduceType) => void;
    stopProduce: (type: ProduceType) => void;

    userJoined: (userId: string) => void;
    userLeft: (userId: string) => void;

    userStartProduce: (userId: string, type: ProduceType) => void;
    userStopProduce: (userId: string, type: ProduceType) => void;
}

const API_CHANNEL = "System";
const ERR_INVALID_STATE = ReferenceError("Voice Client is in an invalid state");
export class Transport {
    api?: RTCDataChannel;
    pc: RTCPeerConnection;
    candidates: RTCIceCandidateInit[];

    constructor(role: Role, public signaling: Signaling, config: RTCConfiguration) {
        this.pc = new RTCPeerConnection(config);
        this.candidates = [];

        if (role == Role.pub) {
            this.pc.createDataChannel(API_CHANNEL);
        }

        this.pc.onicecandidate = ({ candidate }) => {
            if (candidate) {
                this.signaling.trickle({ target: role, candidate });
            }
        };

        this.pc.oniceconnectionstatechange = async () => {
            // iOS iceConnectionState can go straight to "failed" without emitting "disconnected"
            if (this.pc.iceConnectionState == 'disconnected' || this.pc.iceConnectionState == 'failed') {
                if (this.pc.restartIce) {
                    // this will trigger onNegotiationNeeded
                    this.pc.restartIce();
                }
            }
        };
    }
}
export interface VoiceClientConfiguration extends RTCConfiguration {
    codec: 'vp8' | 'vp9' | 'h264';
}

export default class VoiceClient extends EventEmitter<VoiceEvents> {
    private transports?: Transports<Role, Transport>;
    private _supported: boolean;
    private config: VoiceClientConfiguration;

    isDeaf?: boolean;

    userId?: string;
    roomId?: string;
    participants: Map<string, VoiceUser>;
    consumers: Map<string, ConsumerList>;
    signaling: Signaling;

    constructor() {
        super();
        this._supported = true;
        this.config = {
            codec: 'vp8',
            iceServers: [
                {
                    urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
                },
            ],
        };
        this.signaling = new Signaling();
        this.participants = new Map();
        this.consumers = new Map();
        this.isDeaf = false;

        this.signaling.on(
            "data",
            (data) => {
                switch (data.type) {
                    case WSEventType.Accept: {
                        console.log("Accept", data);
                        data.user_ids.forEach((id: string) => {
                            this.participants.set(id, {});
                        });
                        // TODO: connect to available tracks (answer?)
                        this.emit("ready");
                        break;
                    }
                    case WSEventType.Offer: {
                        if (data.description) {
                            this.negotiate(data.description);
                        }
                        break;
                    }
                    case WSEventType.Trickle: {
                        this.trickle(data);
                        break;
                    }
                    case WSEventType.UserJoin: {
                        this.participants.set(data.id, {});
                        console.debug(data);
                        //state.settings.sounds.playSound("call_join");
                        // TODO: connect to user tracks (offer?)
                        this.emit("userJoined", data.id);
                        break;
                    }
                    case WSEventType.UserLeft: {
                        this.participants.delete(data.id);
                        state.settings.sounds.playSound("call_leave");
                        this.emit("userLeft", data.id);

                        //if (this.recvTransport) this.stopConsume(data.id);
                        break;
                    }
                    case WSEventType.UserStartProduce: {
                        const user = this.participants.get(data.id);
                        if (user === undefined) return;
                        switch (data.type) {
                            case "audio":
                                user.audio = true;
                                break;
                            default:
                                throw new Error(
                                    `Invalid produce type ${data.type}`,
                                );
                        }
                        /*
                        if (this.recvTransport)
                            this.startConsume(data.id, data.type);*/
                        this.emit("userStartProduce", data.id, data.type);
                        break;
                    }
                    case WSEventType.UserStopProduce: {
                        const user = this.participants.get(data.id);
                        if (!user) return;
                        switch (data.type) {
                            case "audio":
                                user.audio = false;
                                break;
                            default:
                                throw new Error(
                                    `Invalid produce type ${data.type}`,
                                );
                        }
                        /*
                                                if (this.recvTransport)
                                                    this.stopConsume(data.id, data.type);*/
                        this.emit("userStopProduce", data.id, data.type);
                        break;
                    }
                    default:
                        console.debug(data);
                }
            },
            this,
        );

        this.signaling.on(
            "error",
            () => {
                this.emit("error", new Error("Signaling error"));
            },
            this,
        );

        this.signaling.on(
            "close",
            (error: { code: any; reason: string; }) => {
                this.disconnect(
                    {
                        error: error.code,
                        message: error.reason,
                    },
                    true,
                );
            },
            this,
        );
    }

    addTrack(track: MediaStreamTrack, stream: RemoteStream) {
        voiceState.tracks.set(track.id, stream);
    }

    supported() {
        return this._supported;
    }
    connect(address: string) {
        return this.signaling.connect(address);
    }

    async join(roomId: string, userId: string) {
        this.roomId = roomId;
        this.userId = userId;
        this.transports = {
            [Role.pub]: new Transport(Role.pub, this.signaling, this.config),
            [Role.sub]: new Transport(Role.sub, this.signaling, this.config),
        };

        this.transports[Role.sub].pc.ontrack = (ev: RTCTrackEvent) => {
            const stream = ev.streams[0];
            const remote = makeRemote(stream, this.transports![Role.sub]);

            this.addTrack(ev.track, remote);
        };

        const apiReady = new Promise<void>((resolve) => {
            this.transports![Role.sub].pc.ondatachannel = (ev: RTCDataChannelEvent) => {
                if (ev.channel.label == API_CHANNEL) {
                    this.transports![Role.sub].api = ev.channel;
                    this.transports![Role.pub].api = ev.channel;
                    ev.channel.onmessage = (e) => {
                        try {
                            const msg = JSON.parse(e.data);
                            console.debug(msg);
                            //this.processChannelMessage(msg);
                        } catch (err) {
                            console.error(err);
                        }
                    };
                    resolve();
                    return;
                }
            };
        });

        const offer = await this.transports[Role.pub].pc.createOffer();
        await this.transports[Role.pub].pc.setLocalDescription(offer);
        const answer = await this.signaling.join(roomId, offer);
        console.debug(answer);
        await this.transports[Role.pub].pc.setRemoteDescription(answer);
        this.transports[Role.pub].candidates.forEach((c) => this.transports![Role.pub].pc.addIceCandidate(c));
        this.transports[Role.pub].pc.onnegotiationneeded = () => this.renegotiate(false);
        return apiReady
    }

    disconnect(error?: VoiceError, ignoreDisconnected?: boolean) {
        if (!this.signaling.connected() && !ignoreDisconnected) return;
        this.signaling.disconnect();
        this.participants.clear();
        this.consumers.clear();
        this.userId = undefined;
        this.roomId = undefined;
        if (this.transports) {
            Object.values(this.transports).forEach((t) => t.pc.close());
            this.transports = undefined;
        }

        /*
        this.audioProducer = undefined;

        if (this.sendTransport) this.sendTransport.close();
        if (this.recvTransport) this.recvTransport.close();
        this.sendTransport = undefined;
        this.recvTransport = undefined;
*/
        this.emit("close", error);
    }

    /**@deprecated use join */
    async authenticate(token: string) {
        if (!this.roomId)
            throw ERR_INVALID_STATE;
        const result = await this.signaling.authenticate(token, this.roomId);
        console.info("[Voice client]", result);
        this.userId = result.userId;
        //this.participants = result.partipants;
    }

    async negotiate(description: RTCSessionDescriptionInit) {
        if (!this.transports) {
            throw ERR_INVALID_STATE;
        }
        let answer: RTCSessionDescriptionInit;
        try {
            await this.transports[Role.sub].pc.setRemoteDescription(description);
            this.transports[Role.sub].candidates.forEach((c) => this.transports![Role.sub].pc.addIceCandidate(c));
            this.transports[Role.sub].candidates = [];
            answer = await this.transports[Role.sub].pc.createAnswer();
            await this.transports[Role.sub].pc.setLocalDescription(answer);
            this.signaling.answer(answer);
        } catch (err) {
            console.error(err);
        }
    }

    async renegotiate(iceRestart: boolean) {
        if (!this.transports) {
            throw ERR_INVALID_STATE;
        }

        let offer: RTCSessionDescriptionInit, answer: RTCSessionDescriptionInit;
        try {
            offer = await this.transports[Role.pub].pc.createOffer({ iceRestart });
            await this.transports[Role.pub].pc.setLocalDescription(offer);
            answer = await this.signaling.offer(offer);
            await this.transports[Role.pub].pc.setRemoteDescription(answer);
        } catch (err) {
            console.error(err);
        }
    }

    restartIce() {
        this.renegotiate(true);
    }

    async trickle({ candidate, target }: Trickle) {
        if (!this.transports) {
            throw ERR_INVALID_STATE;
        }

        if (this.transports[target].pc.remoteDescription) {
            this.transports[target].pc.addIceCandidate(candidate);
        } else {
            this.transports[target].candidates.push(candidate);
        }
    }

    async initializeTransports() {
        /*
        const initData = await this.signaling.initializeTransports(
            this.device.rtpCapabilities,
        );

        this.sendTransport = this.device.createSendTransport(
            initData.sendTransport,
        );
        this.recvTransport = this.device.createRecvTransport(
            initData.recvTransport,
        );

        const connectTransport = (transport: Transport) => {
            transport.on("connect", ({ dtlsParameters }, callback, errback) => {
                this.signaling
                    .connectTransport(transport.id, dtlsParameters)
                    .then(callback)
                    .catch(errback);
            });
        };

        connectTransport(this.sendTransport);
        connectTransport(this.recvTransport);

        this.sendTransport.on("produce", (parameters, callback, errback) => {
            const type = parameters.appData.type;
            if (
                parameters.kind === "audio" &&
                type !== "audio" &&
                type !== "saudio"
            )
                return errback();
            if (
                parameters.kind === "video" &&
                type !== "video" &&
                type !== "svideo"
            )
                return errback();
            this.signaling
                .startProduce(type, parameters.rtpParameters)
                .then((id) => callback({ id }))
                .catch(errback);
        });
*/
        this.emit("ready");
        for (const user of this.participants) {
            if (user[1].audio && user[0] !== this.userId)
                this.startConsume(user[0], "audio");
        }
    }

    private async startConsume(userId: string, type: ProduceType) {
        const consumers = this.consumers.get(userId) || {};
        /*
        const consumerParams = await this.signaling.startConsume(userId, type);
        
        const consumer = await this.recvTransport.consume(consumerParams);
        switch (type) {
            case "audio":
                consumers.audio = consumer;
        }

        const mediaStream = new MediaStream([consumer.track]);
        const audio = new Audio();
        audio.srcObject = mediaStream;
        await this.signaling.setConsumerPause(consumer.id, false);
        audio.play();
        this.consumers.set(userId, consumers);*/
    }

    private async stopConsume(userId: string, type?: ProduceType) {
        const consumers = this.consumers.get(userId);
        if (consumers === undefined) return;
        /*
        if (type === undefined) {
            if (consumers.audio !== undefined) consumers.audio.close();
            this.consumers.delete(userId);
        } else {
            switch (type) {
                case "audio": {
                    if (consumers.audio !== undefined) {
                        consumers.audio.close();
                        this.signaling.stopConsume(consumers.audio.id);
                    }
                    consumers.audio = undefined;
                    break;
                }
            }

            this.consumers.set(userId, consumers);
        }*/
    }

    async startProduce(track: MediaStreamTrack, type: ProduceType) {
        /*
        if (this.sendTransport === undefined)
            throw new Error("Send transport undefined");
        const producer = await this.sendTransport.produce({
            track,
            appData: { type },
        });

        switch (type) {
            case "audio":
                this.audioProducer = producer;
                break;
        }
*/
        const participant = this.participants.get(this.userId || "");
        if (participant !== undefined) {
            participant[type] = true;
            this.participants.set(this.userId || "", participant);
        }

        this.emit("startProduce", type);
    }

    async stopProduce(type: ProduceType) {
        let producer;
        /*
        switch (type) {
            case "audio":
                producer = this.audioProducer;
                this.audioProducer = undefined;
                break;
        }

        if (producer !== undefined) {
            producer.close();
            this.emit("stopProduce", type);
        }

        const participant = this.participants.get(this.userId || "");
        if (participant !== undefined) {
            participant[type] = false;
            this.participants.set(this.userId || "", participant);
        }

        try {
            await this.signaling.stopProduce(type);
        } catch (error) {
            // eslint-disable-next-line
            if ((error as any).error === WSErrorCode.ProducerNotFound) return;
            throw error;
        }*/
    }
}