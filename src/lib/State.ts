import stringify from "json-stringify-deterministic";
import localforage from "localforage";
import type { Client, ClientboundNotification } from "revolt.js";
import type Persistent from "./types/Persistent";
import MessageQueue from "./stores/MessageQueue";
import Auth from "./stores/Auth";
import type { Data as DataSync, SyncKeys } from './stores/Sync'
import { clientController } from "./controllers/ClientController";
import { action, makeAutoObservable, reaction, runInAction } from "mobx";
import { injectWindow } from "$lib";
import Layout from "./stores/Layout";
import NotificationOptions from "./stores/NotificationOptions";
import Ordering from "./stores/Ordering";
import Settings from "./stores/Settings";
import Draft from "./stores/Draft";
import Sync from "./stores/Sync";
import Changelog from "./stores/Changelog";
import type Syncable from "./types/Syncable";
import Plugins from "./stores/Plugins";
import LocaleOptions from "./stores/LocaleOptions";
import NetworkOptions from "./stores/NetworkOptions";

export default class State {
    private persistent: [string, Persistent<unknown>][] = [];
    private disabled: Set<string> = new Set;
    auth = new Auth;
    changelog = new Changelog;
    queue = new MessageQueue;
    layout = new Layout;
    locale = new LocaleOptions;
    network = new NetworkOptions;
    notifications: NotificationOptions;
    ordering: Ordering;
    plugins: Plugins;
    settings = new Settings;
    sync: Sync;
    draft = new Draft;

    constructor() {
        makeAutoObservable(this);

        this.disable = this.disable.bind(this);
        this.onPacket = this.onPacket.bind(this);

        this.notifications = new NotificationOptions(this);
        this.ordering = new Ordering(this);
        this.sync = new Sync(this);
        this.plugins = new Plugins(this);
        this.register();
        injectWindow('state', this);
    }

    private register() {
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

    /**
     * Temporarily ignore updates to a key.
     * @param key Key to ignore
     */
    setDisabled(key: string) {
        this.disabled.add(key);
    }
    
    async hydrate() {
        const sync = (await localforage.getItem("sync")) as DataSync;
        const { revision } = sync ?? { revision: {} };
        for (const [id, store] of this.persistent) {
            if (id == "sync") continue;
            const data = await localforage.getItem(id);
            if (typeof data == "object" && data !== null) {
                store.hydrate(data, revision[id] ?? +new Date());
            }
        }
        await this.save();
        clientController.hydrate(this.auth);

        // Post-hydration, init plugins.
        this.plugins.init();
    }

    @action onPacket(packet: ClientboundNotification) {
        if (packet.type == "UserSettingsUpdate") {
            try {
                this.sync.apply(packet.update);
            } catch (err) {
                //reportError(err as any, "failed_sync_apply");
            }
        }
    }
    /**
         * Register reaction listeners for persistent data stores.
         * @returns Function to dispose of listeners
         */
    registerListeners(client?: Client) {
        // If a client is present currently, expose it and provide it to plugins.
        if (client) {
            // Register message listener for clearing queue.
            client.addListener("message", this.queue.onMessage);

            // Register listener for incoming packets.
            client.addListener("packet", this.onPacket);

            
            // Register events for notifications.
            client.addListener("message", this.notifications.onMessage);
            client.addListener(
                "user/relationship",
                this.notifications.onRelationship,
            );
            document.addEventListener(
                "visibilitychange",
                this.notifications.onVisibilityChange,
            );
            
            // Sync settings from remote server.
            state.sync
                .pull(client)
                .catch(console.error)
                .finally(() => state.changelog.checkForUpdates());
        }

        // Register all the listeners required for saving and syncing state.
        const listeners = this.persistent.map(([id, store]) => {
            return reaction(
                () => stringify(store.toJSON()),
                async (value) => {
                    try {
                        // Save updated store to local storage.
                        await localforage.setItem(id, JSON.parse(value));
                        console.log('Data saved to localforage.');

                        // Skip if meta store or client not available.
                        if (id == "sync") return;
                        if (!client) return;

                        // Generate a new revision and upload changes.
                        const revision = +new Date();
                        
                        switch (id) {
                            case "settings": {
                                const { appearance, theme } =
                                    this.settings.toSyncable();
    
                                const obj: Record<string, unknown> = {};
                                if (this.sync.isEnabled("appearance")) {
                                    if (this.disabled.has("appearance")) {
                                        this.disabled.delete("appearance");
                                    } else {
                                        obj["appearance"] = appearance;
                                        this.sync.setRevision(
                                            "appearance",
                                            revision,
                                        );
                                    }
                                }
    
                                if (this.sync.isEnabled("theme")) {
                                    if (this.disabled.has("theme")) {
                                        this.disabled.delete("theme");
                                    } else {
                                        obj["theme"] = theme;
                                        this.sync.setRevision(
                                            "theme",
                                            revision,
                                        );
                                    }
                                }
    
                                if (Object.keys(obj).length) {
                                    if (client.websocket.connected) {
                                        client.syncSetSettings(
                                            obj as any,
                                            revision,
                                        );
                                    }
                                }
                                break;
                            }
                            default: {
                                if (this.sync.isEnabled(id as SyncKeys)) {
                                    if (this.disabled.has(id)) {
                                        this.disabled.delete(id);
                                    }
    
                                    this.sync.setRevision(id, revision);
                                    if (client.websocket.connected) {
                                        console.log("Syncing", store.id, "to API");
                                        client.syncSetSettings(
                                            (
                                                store as unknown as Syncable
                                            ).toSyncable(),
                                            revision,
                                        );
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        console.error("Failed to serialise!");
                        console.error(err);
                        console.error(value);
                    }
                },
            );
        });

        return () => {
            // Remove any listeners attached to client.
            if (client) {
                client.removeListener("message", this.queue.onMessage);
                client.removeListener("packet", this.onPacket);
                client.removeListener("message", this.notifications.onMessage);
                client.removeListener(
                    "user/relationship",
                    this.notifications.onRelationship,
                );
                document.removeEventListener(
                    "visibilitychange",
                    this.notifications.onVisibilityChange,
                );
            }

            // Wipe all listeners.
            listeners.forEach((x) => x());
        };
    }
    reset() {
        runInAction(() => {
            this.draft = new Draft();
            //this.experiments = new Experiments();
            this.layout = new Layout();
            this.notifications = new NotificationOptions(this);
            this.queue = new MessageQueue();
            
            this.settings = new Settings();
            this.sync = new Sync(this);
            this.ordering = new Ordering(this);
            this.save();

            this.persistent = [];
            this.register();
        });
    }

}

export const state = new State;