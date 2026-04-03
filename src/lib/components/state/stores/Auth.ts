import type Persistent from "$lib/types/Persistent";
import { mapToRecord } from "$lib";
import { ObservableMap, action, computed, makeAutoObservable } from "mobx";
import { derived, writable } from "svelte/store";

export interface Data {
    sessions: Record<string, Session>;
}

let current: string | undefined;
const sessions = writable<Data["sessions"]>({});

    function hydrate(data: Data) {
        if (data && "sessions" in data) {
            sessions.set(data.sessions);
        }
    }

    function setSession(session: Session) {
        sessions.update((sessions) => {
            sessions[session.user_id] = session;
            current = session.user_id;
            return sessions;
        });
    }
    
    function removeSession(userId: string) {
        sessions.update((sessions) => {
            delete sessions[userId];
            return sessions;
        });
    }

    function logout() {
        current && removeSession(current);
    }

    function dataToJSON(data: Data["sessions"]): Data {
        return {
            sessions: JSON.parse(JSON.stringify(data))
        }
    }

    function getAccounts(data: Data["sessions"]) {
        return Object.entries(data).map(([_, v])=>v);
    }

const accounts = derived([sessions], ([s])=>getAccounts(s));
const asJSON = derived([sessions], ([s])=>dataToJSON(s));

export const $auth = {
    ...sessions,
    accounts,
    hydrate,
    setSession,
    removeSession,
    logout,
    asJSON,
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
     */
    @action setSession(session: Session) {
        this.sessions.set(session.user_id, session);
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

export const auth = new Auth();