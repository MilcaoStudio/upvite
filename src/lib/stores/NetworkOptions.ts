import type Persistent from "$lib/types/Persistent";
import { action, computed, makeAutoObservable } from "mobx";

export interface Data {
    media: MediaOptions;
}

interface MediaOptions {
    shrinkMedia: boolean;
    autoplay: boolean;
}

export default class NetworkOptions implements Persistent<Data> {

    private mediaOptions: MediaOptions;

    constructor(){
        this.mediaOptions = { shrinkMedia: false, autoplay: true };
        makeAutoObservable(this);
    }

    get id(): string {
        return "connection"
    }

    toJSON() {
        return {
            media: this.mediaOptions,
        }
    }

    @computed get(key: string) {
        switch(key) {
            case "media":
                return this.mediaOptions;
        }
    }

    @action set(key: string, value: Partial<MediaOptions>) {
        if (key == "media") {
            this.mediaOptions = {...this.mediaOptions, ...value}
        }
    }

    @action hydrate(data: Data): void {
        if (data.media) {
            this.mediaOptions = data.media;
        }
    }

}