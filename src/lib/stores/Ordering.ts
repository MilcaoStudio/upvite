import type State from "$lib/State";
import { clientController, useClient } from "$lib/controllers/ClientController";
import { reorder } from "$lib/dnd";
import type Persistent from "$lib/types/Persistent";
import type Syncable from "$lib/types/Syncable";
import { action, computed, makeAutoObservable } from "mobx";
import type { Server } from "stoat.js";
import { BaseStore } from "./Store";
import { derived, get } from "svelte/store";

export interface OrderingData {
    servers: string[];
}

/**
 * Keeps track of ordering of various elements
 */
export default class Ordering implements Persistent<OrderingData>, Syncable {

    /**
     * Ordered list of server IDs
     */
    private servers: string[];

    /**
     * Construct new Layout store.
     */
    constructor() {
        this.servers = [];
        makeAutoObservable(this);
        this.reorderServer = this.reorderServer.bind(this);
    }

    get id() {
        return "ordering";
    }

    toJSON() {
        return {
            servers: this.servers,
        };
    }

    @action hydrate(data: OrderingData) {
        if (data.servers) {
            this.servers = data.servers;
        }
    }

    apply(_key: string, data: unknown, _revision: number): void {
        this.hydrate(data as OrderingData);
    }

    toSyncable() {
        return {
            ordering: JSON.stringify(this.toJSON()),
        };
    }

    /**
     * All known servers with ordering applied
     */
    @computed get orderedServers() {
        const client = useClient();
        const known = new Set(client?.servers.keys() ?? []);
        const ordered = [...this.servers];

        const out = [];
        for (const id of ordered) {
            if (known.delete(id)) {
                out.push(client!.servers.get(id)!);
            }
        }

        for (const id of known) {
            out.push(client.servers.get(id)!);
        }

        return out;
    }

    /**
     * Re-order a server
     */
    @action reorderServer(items: Server[]) {
        this.servers = reorder(items.map((x) => x.id));
    }

    @action reset() {
        this.servers = [];
    }
}


export class OrderingStore extends BaseStore<OrderingData> implements Syncable {
    get id() {
        return "ordering";
    }

    apply(_key: string, data: unknown, _revision: number) {
        this.hydrate(data as OrderingData);
    }

    toSyncable() {
        return {
            ordering: JSON.stringify(get(this.store)),
        }
    }

    hydrate(value: OrderingData): void {
        if (value.servers) {
            this.store.set({servers: value.servers});
        } else {
            throw TypeError("'servers' cannot be undefined");
        }
    }

    reset(): void {
        this.store.set({servers: []});
    }

    get orderedServers() {
        return derived([this.store], ([data])=>{
            const client = useClient();
            const known = new Set(client.servers.keys());
            const out = [];
            for (const id of data.servers) {
                if (known.delete(id)) {
                    const server = client.servers.get(id);
                    if (server) {
                        out.push(server);
                    } else {
                        console.warn("Server %s not found", id);
                    }
                }
            }

            for (const id of known) {
                const server = client.servers.get(id);
                if (server) {
                    out.push(server);
                }
            }

            return out;
        });
    }
}

export const orderingStore = new OrderingStore({servers: []});