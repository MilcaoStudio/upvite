import stringify from "json-stringify-deterministic";
import localforage from "localforage";
import type { Client, ClientboundNotification } from "revolt.js";
import type Persistent from "./types/Persistent";
import MessageQueue from "./stores/MessageQueue";
import Auth from "./stores/Auth";

export default class State {
    private persistent: [string, Persistent<unknown>][] = [];
    private disabled: Set<string> = new Set;
    auth = new Auth;
    queue = new MessageQueue;

    constructor(){
        this.register();
        this.disable = this.disable.bind(this);
        this.onPacket = this.onPacket.bind(this);
    }
    private register(){
        for (const key of Object.getOwnPropertyNames(this)) {
            if (key == 'client') continue;
            const item = (
                this as unknown as Record<string, Record<string, unknown>>
            )[key];

            if (typeof item == 'object') {
                // Check if this is a Store.
                if (typeof item.id == "string") {
                    const id = item.id;

                    // Check if this is a Persistent<T>
                    if (
                        typeof item.hydrate == 'function' &&
                        typeof item.toJSON == 'function'
                    ) {
                        this.persistent.push([
                            id,
                            item as unknown as Persistent<unknown>,
                        ]);
                    }
                }
            }
        }
    }

    disable(key: string) {
        this.disabled.add(key);
    }

    /**
     * Save to local storage
     */
    async save() {
        for (const [id, store] of this.persistent) {
            await localforage.setItem(
                id,
                JSON.parse(stringify(store.toJSON())),
            );
        }
    }

    onPacket(packet: ClientboundNotification){

    }
    
   
}