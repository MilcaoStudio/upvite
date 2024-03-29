import type Persistent from "$lib/types/Persistent";
import { MapStore } from "./Store";
import { mapToRecord } from "$lib";
import { clientController } from "$lib/controllers/ClientController";
import { ObservableMap, action, computed, makeAutoObservable } from "mobx";

interface Account {
    session: Session;
    apiUrl?: string;
}

export interface Data {
    sessions: Record<string, Account>;
}

/**
 * Handles account authentication, managing multiple
 * accounts and their sessions.
 */
export default class Auth implements Persistent<Data> {
    private sessions: ObservableMap;
    private current?: string;

    /**
     * Construct new Auth store.
     */
    constructor() {
        this.sessions = new ObservableMap();
        makeAutoObservable(this);
    }

    get id() {
        return "auth";
    }

    @action toJSON() {
        return {
            sessions: JSON.parse(JSON.stringify(mapToRecord(this.sessions))),
        };
    }

    @action hydrate(data: Data) {
        if (Array.isArray(data.sessions)) {
            data.sessions.forEach(([key, value]) =>
                this.sessions.set(key, value),
            );
        } else if (
            data.sessions && typeof data.sessions == "object"
        ) {
            const v = data.sessions;
            Object.keys(data.sessions).forEach(id =>
                this.sessions.set(id, v[id]),
            );
        }
    }

    /**
     * Add a new session to the auth manager.
     * @param session Session
     * @param apiUrl Custom API URL
     */
    @action setSession(session: Session, apiUrl?: string) {
        this.sessions.set(session.user_id, { session, apiUrl });
    }

    /**
     * Remove existing session by user ID.
     * @param user_id User ID tied to session
     */
    @action removeSession(user_id: string) {
        this.sessions.delete(user_id);
    }

    /**
     * Get all known accounts.
     * @returns Array of accounts
     */
    @computed get accounts() {
        return [...this.sessions.values()];
    }

    /**
     * Remove current session.
     */
    @action logout() {
        this.current && this.removeSession(this.current);
    }

    /**
     * Get current session.
     * @returns Current session
     */
    /*@computed getSession() {
        if (!this.current) return;
        return this.sessions.get(this.current)!.session;
    }*/
}