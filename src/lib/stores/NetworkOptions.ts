import type Persistent from "$lib/types/Persistent";
import { action, computed, makeAutoObservable } from "mobx";

export interface Data {
    media: MediaOptions;
    channel: ChannelOptions;
}

interface MediaOptions {
    shrinkMedia: boolean;
    autoplay: boolean;
}

interface ChannelOptions {
    messagesLimit: number;
}

type Value<T extends keyof Data> = Data[T];

export default class NetworkOptions implements Persistent<Data> {

    private mediaOptions: MediaOptions;
    private channelOptions: ChannelOptions;

    constructor(){
        this.mediaOptions = { shrinkMedia: false, autoplay: true };
        this.channelOptions = { messagesLimit: 100 };
        makeAutoObservable(this);
    }

    get id(): string {
        return "connection"
    }

    toJSON() {
        return {
            media: this.mediaOptions,
            channel: this.channelOptions,
        }
    }

    @computed get media() {
        return this.mediaOptions;
    }

    @computed get channel() {
        return this.channelOptions;
    }

    @action set(key: "media" | "channel", value: Partial<MediaOptions|ChannelOptions>) {
        switch(key) {
            case "media":
                this.mediaOptions = {...this.mediaOptions, ...value};
                break;
            case "channel":
                this.channelOptions = {...this.channelOptions, ...value};
        }
    }

    @action hydrate(data: Data): void {
        if (data.media) {
            this.mediaOptions = data.media;
        }
        if (data.channel) {
            this.channelOptions = data.channel;
        }
    }

}