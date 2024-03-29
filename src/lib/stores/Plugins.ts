import { page } from "$app/stores";
import { mapToRecord } from "$lib";
import { internalEmit, internalSubscribe } from "$lib/InternalEmitter";
import type State from "$lib/State";
import { state } from "$lib/State";
import { modalController } from "$lib/components/modals/ModalController";
import { clientController } from "$lib/controllers/ClientController";
import type Persistent from "$lib/types/Persistent";
import localforage from "localforage";
import { action, computed, makeAutoObservable, ObservableMap } from "mobx";

type Plugin = {
    /**
     * Plugin Format Revision
     */
    format: 1;

    /**
     * Semver Version String
     */
    version: string;

    /**
     * Plugin Namespace
     *
     * This will usually be the author's name.
     */
    namespace: string;

    /**
     * Plugin Id
     *
     * This should be a valid URL slug, i.e. cool-plugin.
     */
    id: string;

    /**
     * Entrypoint
     *
     * Valid Javascript code, must be function which returns object.
     *
     * ```typescript
     * function (state: State) {
     *   return {
     *     onUnload: () => {}
     *   }
     * }
     * ```
     */
    entrypoint: string;

    /**
     * Whether this plugin is enabled
     *
     * @default true
     */
    enabled?: boolean;
};

type Instance = {
    format: 1;
    onUnload?: () => void;
};

// Example plugin:
// state.plugins.add({ format: 1, version: "0.0.1", namespace: "insert", id: "my-plugin", entrypoint: "(state) => { console.log('[my-plugin] Plugin init!'); return { onClient: c => console.log('[my-plugin] Acquired Client:', c, '\\nHello', c.user.username + '!'), onUnload: () => console.log('[my-plugin] bye!') } }" })

export interface Data {
    "plugins": Record<string, Plugin>;
}

/**
 * Handles loading and persisting plugins.
 */
export default class Plugins implements Persistent<Data> {
    private state: State;

    private plugins: ObservableMap<string, Plugin>;
    private instances: Map<string, Instance>;

    /**
     * Construct new Draft store.
     */
    constructor(state: State) {
        this.plugins = new ObservableMap();
        this.instances = new Map();
        makeAutoObservable(this);

        this.state = state;
    }

    apply(_key: string, data: unknown, _revision: number): void {
        this.hydrate(data as Data);
    }

    @computed get ctx() {
        let channel = null, server = null;
        page.subscribe(p => {
            const channel_id = p.params.channel;
            const server_id = p.params.server;
            try {
                channel = clientController.availableClient.channels.get(channel_id);
                server = clientController.availableClient.servers.get(server_id);
            } catch (err) {}
        })
        return {
            emit: internalEmit,
            on: internalSubscribe,
            client: clientController,
            state: state,
            modal: modalController,
            api: clientController.availableClient.api,
            channel,
            server
        }
    }

    get id() {
        return "plugins";
    }

    // lexisother: https://github.com/revoltchat/revite/pull/571#discussion_r836824601
    list() {
        return [...this.plugins.values()].map(
            ({ namespace, id, version, enabled }) => ({
                namespace,
                id,
                version,
                enabled,
            }),
        );
    }

    toJSON() {
        return {
            "plugins": mapToRecord(this.plugins),
        };
    }

    toSyncable(): { [key: string]: object } {
        return {
            plugins: this.toJSON(),
        };
    }

    @action hydrate(data: Data) {
        Object.keys(data["plugins"]).forEach((key) =>
            this.plugins.set(key, data["plugins"][key]),
        );
    }

    /**
     * Get plugin by id
     * @param namespace Namespace
     * @param id Plugin Id
     */
    @computed get(namespace: string, id: string) {
        return this.plugins.get(`${namespace}/${id}`);
    }

    /**
     * Get an existing instance of a plugin
     * @param plugin Plugin Information
     * @returns Plugin Instance
     */
    private getInstance(plugin: Pick<Plugin, "namespace" | "id">) {
        return this.instances.get(`${plugin.namespace}/${plugin.id}`);
    }

    /**
     * Initialise all plugins
     */
    init() {
        //if (!this.state.experiments.isEnabled("plugins")) return;
        this.plugins.forEach(
            ({ namespace, id, enabled }) => enabled && this.load(namespace, id),
        );
    }

    /**
     * Add a plugin
     * @param plugin Plugin Manifest
     */
    add(plugin: Plugin) {
        /*
        if (!this.state.experiments.isEnabled("plugins"))
            return console.error("Enable plugins in experiments!");
        */
        const loaded = this.getInstance(plugin);
        if (loaded) {
            this.unload(plugin.namespace, plugin.id);
        }

        this.plugins.set(`${plugin.namespace}/${plugin.id}`, plugin);

        if (typeof plugin.enabled == "undefined" || plugin) {
            this.load(plugin.namespace, plugin.id);
        }
    }

    /**
     * Remove a plugin
     * @param namespace Plugin Namespace
     * @param id Plugin Id
     */
    remove(namespace: string, id: string) {
        this.unload(namespace, id);
        this.plugins.delete(`${namespace}/${id}`);
    }

    /**
     * Load a plugin
     * @param namespace Plugin Namespace
     * @param id Plugin Id
     */
    load(namespace: string, id: string) {
        const plugin = this.get(namespace, id);
        if (!plugin) throw "Unknown plugin!";

        try {
            const ns = `${plugin.namespace}/${plugin.id}`;
            const instance: Instance = eval(plugin.entrypoint)(this.ctx);
            this.instances.set(ns, {
                ...instance,
                format: plugin.format,
            });

            this.plugins.set(ns, {
                ...plugin,
                enabled: true,
            });
        } catch (error) {
            console.error(`Failed to load ${namespace}/${id}!`);
            console.error(error);
        }
    }

    /**
     * Unload a plugin
     * @param namespace Plugin Namespace
     * @param id Plugin Id
     */
    unload(namespace: string, id: string) {
        const plugin = this.get(namespace, id);
        if (!plugin) throw "Unknown plugin!";

        const ns = `${plugin.namespace}/${plugin.id}`;
        const loaded = this.getInstance(plugin);
        if (loaded) {
            loaded.onUnload?.();
            this.plugins.set(ns, {
                ...plugin,
                enabled: false,
            });
        }
    }

    /**
     * Reset everything
     */
    reset() {
        localforage.removeItem("plugins");
        window.location.reload();
    }
}