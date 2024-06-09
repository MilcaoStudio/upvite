import type State from "$lib/State";
import { clientController } from "$lib/controllers/ClientController";
import { reorder } from "$lib/dnd";
import type Persistent from "$lib/types/Persistent";
import type Syncable from "$lib/types/Syncable";
import { action, computed, makeAutoObservable } from "mobx";
import type { Server } from "revolt.js";

export interface Data {
    servers?: string[];
}

/**
 * Keeps track of ordering of various elements
 */
export default class Ordering implements Persistent<Data>, Syncable {
    private state: State;

    /**
     * Ordered list of server IDs
     */
    private servers: string[];

    /**
     * Construct new Layout store.
     */
    constructor(state: State) {
        this.servers = [];
        makeAutoObservable(this);

        this.state = state;
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

    @action hydrate(data: Data) {
        if (data.servers) {
            this.servers = data.servers;
        }
    }

    apply(_key: string, data: unknown, _revision: number): void {
        this.hydrate(data as Data);
    }

    toSyncable(): { [key: string]: object } {
        return {
            ordering: this.toJSON(),
        };
    }

    /**
     * All known servers with ordering applied
     */
    @computed get orderedServers() {
        const client = clientController.readyClient;
        const known = new Set(client?.servers.keys() ?? []);
        const ordered = [...this.servers];

        const out = [];
        for (const id of ordered) {
            if (known.delete(id)) {
                out.push(client!.servers.get(id)!);
            }
        }

        for (const id of known) {
            out.push(client!.servers.get(id)!);
        }

        return out;
    }

    /**
     * Re-order a server
     */
    @action reorderServer(items: Server[]) {
        this.servers = reorder(items.map((x) => x.id));
    }
}