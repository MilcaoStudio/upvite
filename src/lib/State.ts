import stringify from "json-stringify-deterministic";
import localforage from "localforage";
import type { Client } from "stoat.js";
import type Persistent from "./types/Persistent";
import MessageQueue from "./stores/MessageQueue";
import { $auth, type Data as AuthData } from "./stores/Auth";
import type { Data as DataSync, SyncKeys } from './stores/Sync'
import { clientController } from "./controllers/ClientController";
import { makeAutoObservable, reaction, runInAction } from "mobx";
import { injectWindow } from "$lib";
import Layout from "./stores/Layout";
import { notificationsStore } from "./stores/NotificationOptions";
import { orderingStore, type OrderingData } from "./stores/Ordering";
import { settings } from "./stores/Settings";
import Draft from "./stores/Draft";
import { sync } from "./stores/Sync";
import Changelog from "./stores/Changelog";
import type Syncable from "./types/Syncable";
import Plugins from "./stores/Plugins";
import LocaleOptions from "./stores/LocaleOptions";
import NetworkOptions from "./stores/NetworkOptions";

export default class State {
    private persistent: [string, Persistent<unknown>][];
    //auth = new Auth;
    changelog = new Changelog;
    queue = new MessageQueue;
    layout = new Layout;
    locale = new LocaleOptions;
    network = new NetworkOptions;
    //notifications: NotificationOptions;
    //ordering: Ordering;
    plugins: Plugins;
    //settings = new Settings;
    //sync: Sync;
    draft = new Draft;

    constructor() {
        this.persistent = [["notifications", notificationsStore],
            //["settings", settings]
        ]
        makeAutoObservable(this);

        //this.disable = this.disable.bind(this);

        //this.notifications = new NotificationOptions();
        //this.ordering = new Ordering();
        //this.sync = new Sync();
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

    /*
    disable(key: string) {
        this.disabled.add(key);
    }*/

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
        console.debug("[save] Local data saved");
    }

    async hydrate() {
        try {
            const sync = (await localforage.getItem("sync")) as DataSync;
            const { revision } = sync ?? { revision: {} };

            const authData = await localforage.getItem<AuthData>("auth");
            if (authData) {
                $auth.hydrate(authData);
            }
            const ordering = await localforage.getItem<OrderingData>("ordering");
            if (ordering) {
                orderingStore.hydrate(ordering);
            }

            for (const [id, store] of this.persistent) {
                if (id == "sync") continue;
                const data = await localforage.getItem(id);
                if (typeof data == "object" && data !== null) {
                    store.hydrate(data, revision[id] ?? +new Date());
                }
            }
            await this.save();
            clientController.hydrate();

            // Post-hydration, init plugins.
            this.plugins.init();
        } catch (error) {
            console.error(error)
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

            // Register listener for user settings update
            client.addListener("userSettingsUpdate", sync.apply);

            // Register events for notifications.
            client.addListener("message", notificationsStore.onMessage);
            client.addListener(
                "user/relationship",
                notificationsStore.onRelationship,
            );
            document.addEventListener(
                "visibilitychange",
                notificationsStore.onVisibilityChange,
            );

            // Sync settings from remote server.
            sync
                .pull(client)
                .catch(console.error)
                .finally(() => state.changelog.checkForUpdates());
        }

        const authUnsubscribe = $auth.subscribe((sessions) => {
            localforage.setItem("auth", JSON.parse(stringify({ sessions }))).then(() => {
                console.debug("[$auth] auth saved in localforage");
            });
        });
        const orderingUnsubscribe = orderingStore.subscribe((data) => {
            localforage.setItem("ordering", JSON.parse(stringify(data))).then(() => {
                console.debug("[$ordering] ordering saved in localforage");
            });
        })
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
                                const { appearance, theme } = settings.toSyncable();

                                const obj: Record<string, unknown> = {};
                                if (sync.isEnabled("appearance")) {
                                    obj["appearance"] = appearance;
                                    sync.setRevision(
                                        "appearance",
                                        revision,
                                    );
                                }

                                if (sync.isEnabled("theme")) {
                                    obj["theme"] = theme;
                                    sync.setRevision(
                                        "theme",
                                        revision,
                                    );
                                }

                                if (Object.keys(obj).length && client.ready()) {
                                    await client.account.setSettings(obj, revision);
                                }
                                break;
                            }
                            default: {
                                if (sync.isEnabled(id as SyncKeys)) {
                                    sync.setRevision(id, revision);
                                    if (client.ready()) {
                                        console.log("Syncing", store.id, "to API");
                                        await client.account.setSettings((store as unknown as Syncable).toSyncable(), revision);
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
                client.removeListener("userSettingsUpdate", sync.apply);
                client.removeListener("message", notificationsStore.onMessage);
                client.removeListener(
                    "user/relationship",
                    notificationsStore.onRelationship,
                );
                document.removeEventListener(
                    "visibilitychange",
                    notificationsStore.onVisibilityChange,
                );
            }

            authUnsubscribe();
            orderingUnsubscribe();

            // Wipe all listeners.
            listeners.forEach((x) => x());
        };
    }
    reset() {
        runInAction(() => {
            this.draft = new Draft();
            //this.experiments = new Experiments();
            this.layout = new Layout();
            //this.notifications = new NotificationOptions();
            this.queue = new MessageQueue();

            //this.settings = new Settings();
            //this.sync = new Sync();
            //this.ordering = new Ordering();
            this.save();

            this.persistent = [];
            this.register();
        });
    }

}

export const state = new State;