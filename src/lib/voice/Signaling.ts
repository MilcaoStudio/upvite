import EventEmitter from "eventemitter3";

import {
    type AuthenticationResult,
    type TransportInitDataTuple,
    WSCommandType,
    WSErrorCode,
    type ProduceType,
    type ConsumerData,
    type Trickle,
} from "../types/Voice";

interface SignalingEvents {
    open: (event: Event) => void;
    close: (event: CloseEvent) => void;
    error: (event: Event) => void;
    data: (data: any) => void;

    negociate: (data: any) => void;
    trickle: (data: any) => void;
}

export default class Signaling extends EventEmitter<SignalingEvents> {
    ws?: WebSocket;
    peer?: RTCPeerConnection;
    index: number;
    pending: Map<number, (data: unknown) => void>;

    constructor() {
        super();
        this.index = 0;
        this.pending = new Map();
    }

    connected(): boolean {
        return (
            this.ws != undefined &&
            this.ws.readyState < WebSocket.CLOSING
        );
    }

    async connect(address: string): Promise<void> {
        this.disconnect();
        this.ws = new WebSocket(address);
        this.ws.onopen = (e) => this.emit("open", e);
        this.ws.onclose = (e) => this.emit("close", e);
        this.ws.onerror = (e) => this.emit("error", e);
        this.ws.onmessage = (e) => this.parseData(e);

        let finished = false;
        return new Promise((resolve, reject) => {
            this.once("open", () => {
                if (finished) return;
                finished = true;
                resolve();
            });

            this.once("error", () => {
                if (finished) return;
                finished = true;
                reject();
            });
        });
    }

    disconnect() {
        if (
            this.ws != undefined &&
            this.ws.readyState != WebSocket.CLOSED &&
            this.ws.readyState != WebSocket.CLOSING
        )
            this.ws.close(1000);
        this.peer?.close();
    }

    private parseData(event: MessageEvent) {
        if (typeof event.data != "string") return;
        const json = JSON.parse(event.data);
        //const entry = this.pending.get(json.id);
        console.debug("Received:", this.index, event.data);
        const entry = this.pending.get(this.index);
        if (!entry) {
            this.emit("data", json);
            return;
        }

        entry(json);
        this.index++;
    }

    answer(description: RTCSessionDescriptionInit) {
        return this.sendRequest(WSCommandType.Answer, description);
    }

    join(room_id: string, offer: RTCSessionDescriptionInit) {
        return this.sendRequest(WSCommandType.Join, {room_id, offer,})
    }

    offer(description: RTCSessionDescriptionInit) {
        return this.sendRequest(WSCommandType.Offer, description)
    }

    // Connect -> Accept
    // Join -> Offer
    sendRequest(type: string, data?: any): Promise<any> {
        if (!this.ws || this.ws.readyState != WebSocket.OPEN)
            return Promise.reject({ error: WSErrorCode.NotConnected });

        const ws = this.ws;
        return new Promise((resolve, reject) => {
            if (this.index >= 2 ** 32) this.index = 0;
            while (this.pending.has(this.index)) this.index++;
            const onClose = (e: CloseEvent) => {
                reject({
                    error: e.code,
                    message: e.reason,
                });
            };

            const finishedFn = (data: any) => {
                this.removeListener("close", onClose);
                if (data.error)
                    reject({
                        error: data.error,
                        message: data.message,
                        data: data.data,
                    });
                resolve(data);
            };
            this.index++;
            this.pending.set(this.index, finishedFn);
            this.once("close", onClose);
            const json = {
                id: this.index,
                type,
                ...data,
            };
            console.debug("Sent:", this.index);
            ws.send(`${JSON.stringify(json)}\n`);
        });
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    trickle(trickle: Trickle) {
        return this.sendRequest(WSCommandType.Trickle, {trickle})
    }
    authenticate(token: string): Promise<AuthenticationResult> {
        return this.sendRequest(WSCommandType.Connect, { token });
    }

    /**
    initializeTransports(
        rtpCapabilities: RtpCapabilities,
    ): Promise<TransportInitDataTuple> {
        return this.sendRequest(WSCommandType.InitializeTransports, {
            mode: "SplitWebRTC",
            rtpCapabilities,
        });
    }

    connectTransport(
        id: string,
        dtlsParameters: DtlsParameters,
    ): Promise<void> {
        return this.sendRequest(WSCommandType.ConnectTransport, {
            id,
            dtlsParameters,
        });
    }

    async startProduce(
        type: ProduceType,
        rtpParameters: RtpParameters,
    ): Promise<string> {
        const result = await this.sendRequest(WSCommandType.StartProduce, {
            type,
            rtpParameters,
        });
        return result.producerId;
    }

    stopProduce(type: ProduceType): Promise<void> {
        return this.sendRequest(WSCommandType.StopProduce, { type });
    }

    startConsume(userId: string, type: ProduceType): Promise<ConsumerData> {
        return this.sendRequest(WSCommandType.StartConsume, { type, userId });
    }

    stopConsume(consumerId: string): Promise<void> {
        return this.sendRequest(WSCommandType.StopConsume, { id: consumerId });
    }

    setConsumerPause(consumerId: string, paused: boolean): Promise<void> {
        return this.sendRequest(WSCommandType.SetConsumerPause, {
            id: consumerId,
            paused,
        });
    }*/
}