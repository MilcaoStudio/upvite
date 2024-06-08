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
import { clientController, useClient } from "$lib/controllers/ClientController";
import { LocalStream, makeRemote, type Constraints, type RemoteStream } from "./Stream";
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

        /*
        if (role == Role.pub) {
            this.pc.createDataChannel(API_CHANNEL);
            console.info("Create data channel System");
        }*/

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

        this.pc.ondatachannel = ({ channel }) => {
            console.debug(channel.label);
        };
    }
}
export interface VoiceClientConfiguration extends RTCConfiguration {
    codec: 'vp8' | 'vp9' | 'h264';
}

export default class VoiceClient extends EventEmitter<VoiceEvents> {
    private transports: Transports<Role, Transport> | undefined;
    private config: VoiceClientConfiguration;
    private apiClient = useClient();

    isDeaf?: boolean;

    userId?: string;
    roomId?: string;
    participants: Map<string, VoiceUser>;
    pendingNegotiation: boolean;
    consumers: Map<string, ConsumerList>;
    signaling: Signaling;

    constructor() {
        super();
        this.pendingNegotiation = false;
        this.config = {
            codec: 'vp8',
            iceServers: [
                {
                    urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun.12connect.com:3478'],
                },
            ],
        };
        this.signaling = new Signaling();
        this.participants = new Map();
        this.consumers = new Map();
        this.isDeaf = false;

        this.signaling.on(
            "data",
            async (data) => {
                switch (data.type) {
                    case WSEventType.Answer: {
                        if (!this.transports) {
                            break;
                        }
                        const answer = data.description;
                        const publisher = this.transports[Role.pub];
                        
                        await publisher.pc.setRemoteDescription(answer);
                        console.debug("Answer accepted for publisher");
                        publisher.candidates.forEach((c) => { publisher.pc.addIceCandidate(c) });
                        // try renegotiation
                        publisher.pc.onnegotiationneeded = () => this.renegotiate(false);
                        break;
                    }
                    case WSEventType.Accept: {
                        console.log("Accept", data);

                        this.emit("ready");
                        break;
                    }
                    case WSEventType.Offer: {
                        if (!this.transports) {
                            break;
                        }
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
                        this.participants.set(data.user_id, { room: data.room });
                        //state.settings.sounds.playSound("call_join");
                        this.emit("userJoined", data.user_id);
                        break;
                    }
                    case WSEventType.UserLeft: {
                        this.participants.delete(data.id);
                        //state.settings.sounds.playSound("call_leave");
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
                        console.debug("Unknown message:", data);
                }
            },
            this,
        );

        this.signaling.on(
            "error", () => this.emit("error", new Error("Signaling error")), this,
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

    addRemoteStream(track: MediaStreamTrack, stream: RemoteStream) {
        voiceState.streams.set(track.id, stream);
    }

    supported() {
        return navigator.mediaDevices != undefined;
    }
    connect(address: string) {
        return this.signaling.connect(address);
    }

    async join(roomId: string, local: LocalStream) {
        if (this.roomId) {
            console.warn("Already connected to a room. Leaving %c%s.", "color:aqua;", this.roomId);
            this.leave();
        }

        const transports = {
            [Role.pub]: new Transport(Role.pub, this.signaling, this.config),
            [Role.sub]: new Transport(Role.sub, this.signaling, this.config),
        };

        this.transports = transports;
        this.roomId = roomId;

        // Subscriber ontrack
        transports[Role.sub].pc.ontrack = (ev: RTCTrackEvent) => {
            const stream = ev.streams[0];
            const remote = makeRemote(stream, transports[Role.sub]);

            this.addRemoteStream(ev.track, remote);
        };

        // Subscriber ondatachannel
        transports[Role.sub].pc.ondatachannel = (ev: RTCDataChannelEvent) => {
            console.debug("New message from", ev.channel.label);
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
            }
        };

        // Publisher adds track
        local.publish(this.transports[Role.pub]);

        const offer = await transports[Role.pub].pc.createOffer();
        await transports[Role.pub].pc.setLocalDescription(offer);
        this.signaling.join(roomId, offer);
    }

    disconnect(error?: VoiceError, ignoreDisconnected?: boolean) {
        if (!this.signaling.connected() && !ignoreDisconnected) return;
        this.leave()
        this.signaling.disconnect();
        this.userId = undefined;

        /*
        this.audioProducer = undefined;

        if (this.sendTransport) this.sendTransport.close();
        if (this.recvTransport) this.recvTransport.close();
        this.sendTransport = undefined;
        this.recvTransport = undefined;
*/
        this.emit("close", error);
    }

    leave() {
        if (!this.roomId) return;
        this.signaling.leave();
        this.participants.clear();
        this.consumers.clear();
        this.roomId = undefined;
        if (this.transports) {
            Object.values(this.transports).forEach((t) => t.pc.close());
            this.transports = undefined;
        }
    }

    async authenticate(userId: string) {
        this.signaling.authenticate(userId, [...this.apiClient.channels.values()].filter(c => c.type == "VoiceChannel").map(c => c.id));
        // Response should be a token
        this.userId = userId;
    }

    async negotiate(description: RTCSessionDescriptionInit) {
        if (description.type != "offer") {
            console.warn("Negotiate description type is", description.type);
        }
        if (!this.transports) {
            throw ERR_INVALID_STATE;
        }
        let answer: RTCSessionDescriptionInit;
        this.pendingNegotiation = true;
        console.debug("Start negotiation");
        try {
            const subscriber = this.transports[Role.sub];
            await subscriber.pc.setRemoteDescription(description);
            console.debug("Offer accepted for subscriber");
            console.debug(subscriber.candidates);
            subscriber.candidates.forEach((c) => this.transports![Role.sub].pc.addIceCandidate(c));
            subscriber.candidates = [];
            answer = await subscriber.pc.createAnswer();
            await this.transports[Role.sub].pc.setLocalDescription(answer);
            this.signaling.answer(answer);
        } catch (err) {
            console.error(err);
        } finally {
            this.pendingNegotiation = false;
        }
    }

    async renegotiate(iceRestart: boolean) {
        if (!this.transports) {
            throw ERR_INVALID_STATE;
        }

        this.pendingNegotiation = true;
        console.debug("Starting renegotiation");
        let offer: RTCSessionDescriptionInit;
        try {
            offer = await this.transports[Role.pub].pc.createOffer({ iceRestart });
            await this.transports[Role.pub].pc.setLocalDescription(offer);
            console.debug("Sending new offer");
            this.signaling.offer(offer);
            console.debug("Awaiting an answer...");
        } catch (err) {
            console.error(err);
        } finally {
            this.pendingNegotiation = false;
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