import { browser } from "$app/environment";
import { mapToRecord } from "$lib";
import type Persistent from "$lib/types/Persistent";
import { ObservableMap, action, computed, makeAutoObservable, observable } from "mobx";

/**
 * SMALL = Smartphones
 * MEDIUM = Tablets
 * LARGE = PC, consoles
 */
export enum Viewport {
    SMALL,
    MEDIUM,
    LARGE,
    //EXTRA_LARGE,
}
export interface Data {
    lastSection?: "home" | "server";
    lastHomePath?: string;
    lastOpened?: Record<string, string>;
    openSections?: Record<string, boolean>;
    viewport?: Viewport;
}

export const SIDEBAR_MEMBERS = "sidebar_members";
export const SIDEBAR_CHANNELS = "sidebar_channels";
export const SECTION_MENTION = "mention";
export const SECTION_NSFW = "nsfw";

/**
 * Keeps track of the last open channels, tabs, etc.
 * Handles providing good UX experience on navigating
 * back and forth between different parts of the app.
 */
export default class Layout implements Persistent<Data> {
    /**
    * The last 'major section' that the user had open.
    * This is either the home tab or a channel ID (for a server channel).
    */
    @observable public lastSection: "home" | "discover" | string;

    /**
     * The last path the user had open in the home tab.
     */
    private lastHomePath: string;

    /**
     * Volatile last discover path.
     */
    private lastDiscoverPath: string;

    /**
     * Map of last channels viewed in servers.
     */
    private lastOpened: ObservableMap<string, string>;

    /**
     * Map of section IDs to their current state.
     */
    private openSections: ObservableMap<string, boolean>;

    private viewport: Viewport | undefined;

    /**
     * Construct new Layout store.
     */
    constructor() {
        this.lastSection = "home";
        this.lastHomePath = "/";
        this.lastDiscoverPath = "/discover/servers";
        this.lastOpened = new ObservableMap();
        this.openSections = new ObservableMap();

        if (browser) {
            this.setViewport();
        }

        this.getLastHomePath = this.getLastHomePath.bind(this);

        makeAutoObservable(this);
    }

    get id(): string {
        return 'layout'
    }

    toJSON(): unknown {
        return {
            lastSection: this.lastSection,
            lastHomePath: this.lastHomePath,
            lastOpened: mapToRecord(this.lastOpened),
            openSections: mapToRecord(this.openSections),
            viewport: this.viewport,
        };
    }

    @action hydrate(data: Data) {
        if (data.lastSection) {
            this.lastSection = data.lastSection;
        }

        if (data.lastHomePath) {
            this.lastHomePath = data.lastHomePath;
        }

        if (data.lastOpened) {
            Object.keys(data.lastOpened).forEach((key) =>
                this.lastOpened.set(key, data.lastOpened![key]),
            );
        }

        if (data.openSections) {
            Object.keys(data.openSections).forEach((key) =>
                this.openSections.set(key, data.openSections![key]),
            );
        }

        if (data.viewport) {
            this.viewport = data.viewport;
        }
    }

    /**
     * Get last opened channel in a server.
     * @param server Server ID
     */
    @computed getLastOpened(server: string) {
        return this.lastOpened.get(server);
    }

    /**
     * Get the path to a server (as seen on sidebar).
     * @param server Server ID
     * @returns Pathname
     */
    @computed getServerPath(server: string) {
        let path = `/server/${server}`;
        if (this.lastOpened.has(server)) {
            path += `/channel/${this.getLastOpened(server)}`;
        }

        return path;
    }

    /**
     * Set last opened channel in a server.
     * @param server Server ID
     * @param channel Channel ID
     */
    @action setLastOpened(server: string, channel: string) {
        this.lastOpened.set(server, channel);
        this.lastSection = server;
    }

    /**
     * Get the last path the user had open in the home tab.
     * @returns Last home path
     */
    @computed getLastHomePath() {
        return this.lastHomePath
    }

    /**
     * Get the last path the user had open.
     * @returns Last path
     */
    @computed getLastPath() {
        return (
            (this.lastSection === "discover"
                ? this.lastDiscoverPath
                : this.lastSection === "home"
                    ? this.lastHomePath
                    : this.getServerPath(this.lastSection)!) ??
            this.lastHomePath ??
            "/"
        )
    }

    /**
     * Set the current path open in the home tab.
     * @param path Pathname
     */
    @action setLastHomePath(path: string) {
        if (path.startsWith("/bot")) return;
        if (path.startsWith("/invite")) return;

        this.lastHomePath = path;
        this.lastSection = "home"
    }

    /**
     * Set the last discover path.
     * @param path Pathname
     */
    @action setLastDiscoverPath(path: string) {
        this.lastDiscoverPath = path;
        this.lastSection = "discover"
    }

    /**
     *
     * @param id Section ID
     * @returns Whether the section is open
     * @param def Default state value
     */
    @computed getSectionState(id: string, def?: boolean) {
        return this.openSections.get(id) ?? def ?? false
    }

    /**
     * Set the state of a section.
     * @param id Section ID
     * @param value New state value
     * @param def Default state value
     */
    @action setSectionState(id: string, value: boolean, def?: boolean) {
        if (value === def) {
            this.openSections.delete(id);
        } else {
            this.openSections.set(id, value);
        }
    }

    /**
     * Toggle state of a section.
     * @param id Section ID
     * @param def Default state value
     */
    @action toggleSectionState(id: string, def?: boolean) {
        this.setSectionState(id, !this.getSectionState(id, def), def);
    }

    /**
     * Gets the viewport category according to window's width
     * @returns Viewport if defined, otherwise undefined
     */
    @computed getViewport() {
        return this.viewport
    }

    @action setViewport(width = window.visualViewport?.width) {
        this.viewport = width && (
            width > 1200 ?
                Viewport.LARGE :
                width > 768 ?
                    Viewport.MEDIUM :
                    Viewport.SMALL);
    }
}