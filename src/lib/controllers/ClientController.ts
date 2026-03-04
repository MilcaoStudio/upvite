import { Client, ConnectionState, type API } from "stoat.js";
import { modalController } from "../components/modals/ModalController";
import { detect } from "detect-browser";
import { env } from "$env/dynamic/public"
import { injectWindow, takeError } from "$lib";
import { ObservableMap, action, computed, makeAutoObservable, observable } from "mobx";
import { browser } from "$app/environment";
import { voiceState } from "$lib/voice/VoiceState";
import { goto } from "$app/navigation";
import { auth, $auth } from "$lib/stores/Auth";
import { settings } from "$lib/stores/Settings";
import { notificationsStore } from "$lib/stores/NotificationOptions";
import { get, writable } from "svelte/store";

/**
 * Current lifecycle state
 */
type SessionState = "Ready" | "Connecting" | "Online" | "Disconnected" | "Offline";

/**
 * Possible transitions between states
 */
type Transition =
    | {
        action: "LOGIN";
        apiUrl?: string;
        session: SessionPrivate;
        configuration?: API.RevoltConfig;

        knowledge: "new" | "existing";
    }
    | {
        action:
        | "CONNECT"
        | "READY"
        | "DISCONNECT"
        | "RECONNECT"
        | "RETRY"
        | "LOGOUT"
        | "ONLINE"
        | "OFFLINE";
    };

export default class Session {
    //_state: SessionState = navigator.onLine ? "Online" : "Offline";
    state = writable<SessionState>(navigator.onLine ? "Online" : "Offline"); 
    user_id: string | undefined;
    client: Client | null = null;
    #retryTimeout: number | undefined;
    #permanentError: string | undefined;
    #connectionFailures = 0;
    /**
     * Create a new Session
     */
    constructor() {
        makeAutoObservable(this);
        this.onDropped = this.onDropped.bind(this);
        this.onReady = this.onReady.bind(this);
        this.onOnline = this.onOnline.bind(this);
        this.onOffline = this.onOffline.bind(this);
        this.onError = this.onError.bind(this);

        window.addEventListener("online", this.onOnline);
        window.addEventListener("offline", this.onOffline);
    }
    /**
     * Initiate logout and destroy client
     */
    @action destroy() {
        console.debug("[destroy]");
        if (this.client) {
            this.client.events.disconnect();
            this.state.set("Ready");
            this.client = null;
        }
    }

    /**
     * Called when user's browser signals it is online
     */
    private onOnline() {
        this.emit({
            action: "ONLINE",
        });
    }

    /**
     * Called when user's browser signals it is offline
     */
    private onOffline() {
        this.emit({
            action: "OFFLINE",
        });
    }

    /**
     * Called when the client signals it has disconnected
     */
    private onDropped() {
        this.emit({
            action: "DISCONNECT",
        });
    }

    private onError(err: {type: "Error", data: API.Error}) {
        if (err.type == "Error") {
            if (err.data.type == "InvalidSession") {
                $auth.logout();
                this.destroyClient();
            } else {
                modalController.push({type: "error", error: err.data.type})
            }
        }
    }

    /**
     * Called when the client signals it has received the Ready packet
     */
    private onReady() {
        //resetMemberSidebarFetched();
        this.emit({
            action: "READY",
        });
    }

    /**
     * Create a new Revolt.js Client for this Session
     * @param apiUrl Optionally specify an API URL
     */
    private createClient(apiUrl?: string) {
        this.client = new Client({
            baseURL: apiUrl ?? env.PUBLIC_API_URL,
            autoReconnect: false,
            syncUnreads: true,
            //debug: import.meta.env.DEV,
            /** 
            channelIsMuted: (channel) =>
              this.#controller.state.notifications.isMuted(channel),
            channelExclusiveMuted: (channel) =>
              this.#controller.state.notifications.isChannelMuted(channel),*/
        });

        //this.client.addListener("dropped", this.onDropped);
        this.client.events.on("state", this.onState);
        this.client.addListener("disconnected", this.onDropped);
        this.client.addListener("ready", this.onReady);
        this.client.addListener("error", this.onError);
    }

    /**
     * Destroy the client including any listeners.
     */
    private destroyClient() {
        if (this.client) {
            this.client!.events.removeAllListeners();
            this.client!.removeAllListeners();
            this.client!.events.disconnect();
        }
        this.user_id = undefined;
        this.client = null;
        goto("/login");
    }

    /**
     * Ensure we are in one of the given states
     * @param state Possible states
     */
    private assert(...state: SessionState[]) {
        const actual = get(this.state);
        let found = state.some((target) => actual == target);

        if (!found) {
            console.warn(`State must be ${state} in order to transition! (currently ${state})`);
        }
    }

    /**
     * Continue logging in provided onboarding is successful
     * @param data Transition Data
     */
    private continueLogin(data: Transition & { action: "LOGIN" }) {
        try {
            this.user_id = this.client!.user?.id;
            $auth.setSession(data.session);
            //voiceState.loadVoice(this.client!);
        } catch (err) {
            this.state.set("Online");
            throw err;
        }
    }

    /**
     * Transition to a new state by a certain action
     * @param data Transition Data
     */
    @action async emit(data: Transition) {
        console.info(`[FSM ${this.user_id ?? "Anonymous"}]`, data);

        // Clean up retry timer
        if (this.#retryTimeout) {
            clearTimeout(this.#retryTimeout);
            this.#retryTimeout = undefined;
        }

        switch (data.action) {
            // Login with session
            case "LOGIN": {
                this.assert("Online");
                this.state.set("Connecting");
                this.createClient(data.apiUrl);

                
                if (this.client) {
                    this.client.configuration = data.configuration || await this.client.api.get("/");
                    this.client.useExistingSession(data.session);
                }

                if (data.knowledge == "new") {
                    /*
                    this.client!.session = data.session;
                    (this.client! as any).$updateHeaders();*/
                    const { onboarding } = await this.client!.api.get(
                        "/onboard/hello",
                    );

                    if (onboarding) {
                        /*
                        modalController.push({
                            type: "onboarding",
                            callback: async (username: string) =>
                                this.client!.completeOnboarding(
                                    { username },
                                    false,
                                ).then(() => this.continueLogin(data)),
                        });
*/
                        return;
                    }
                    
                    this.continueLogin(data);
                }
                this.emit({action: "CONNECT"});
                break;
            }
            case "CONNECT":
            case "RECONNECT": {
                this.state.set("Connecting");
                this.client?.connect();
                break;
            }
            // Ready successfully received
            case "READY": {
                this.assert("Connecting");
                this.state.set("Ready");
                this.#connectionFailures = 0;
                break;
            }
            // Client got disconnected
            case "DISCONNECT": {
                this.state.set("Disconnected");
                break;
            }
            // We should try reconnecting
            case "RETRY": {
                this.#connectionFailures++;
                this.assert("Disconnected", "Connecting");
                const retryIn =
                   (Math.pow(2, this.#connectionFailures) - 1) * (0.8 + Math.random() * 0.4);

                console.info(
                    "Will try to reconnect in",
                    retryIn.toFixed(2),
                    "seconds!",
                );

                this.#retryTimeout = setTimeout(() => {
                    this.#retryTimeout = undefined;
                    this.emit({action: "RECONNECT"});
                }, retryIn * 1e3) as never;
                break;
            }
            // User instructed logout
            case "LOGOUT": {
                this.assert("Connecting", "Online", "Ready");
                this.state.set("Disconnected");
                this.destroyClient();
                break;
            }
            // Browser went offline
            case "OFFLINE": {
                this.state.set("Offline");
                break;
            }
            // Browser went online
            case "ONLINE": {
                this.assert("Offline");
                if (this.client) {
                    this.state.set("Connecting");
                    this.emit({
                        action: "RETRY",
                    });
                } else {
                    this.state.set("Online");
                }
                break;
            }
        }
    }

    /**
     * Whether we are ready to render.
     * @returns Boolean
     */
    @computed get ready() {
        return !!this.client?.user;
    }

    private onState(state: ConnectionState) {
        console.debug(state);
    }
}
export class ClientController {
    /**
     * API client
     */
    private apiClient: Client | null = null;

    /**
     * Server configuration
     */
    private configuration: API.RevoltConfig | null;

    /**
     * Map of user IDs to sessions
     */
    private sessions: ObservableMap<string, Session>
    
    ready = writable(false);
    loggedIn = writable(false);

    /**
     * User ID of active session
     */
    private current: string | null;

    constructor() {
        this.configuration = null;
        if (browser) {
            if (!env.PUBLIC_API_URL) {
                throw ReferenceError("PUBLIC_API_URL environment variable is undefined. PUBLIC_API_URL is mandatory for client controller.");
            }

            this.apiClient = new Client({
                baseURL: env.PUBLIC_API_URL,
            });

            /*
            this.apiClient
                .fetchConfiguration()
                .then(() => (this.configuration = this.apiClient!.configuration!));
                */
            this.apiClient?.api.get("/").then((config) => this.configuration = config);
        }

        this.sessions = observable.map();
        this.current = null;

        makeAutoObservable(this);

        this.login = this.login.bind(this);
        this.logoutCurrent = this.logoutCurrent.bind(this);

        injectWindow('clientController', this);
    }

    @action pickNextSession() {
        this.switchAccount(
            this.current ?? this.sessions.keys().next().value ?? null,
        );
    }

    /**
     * Hydrate sessions and start client lifecycles.
     * @param auth Authentication store
     */
    @action hydrate() {
        for (const session of get($auth.accounts)) {
            console.log("[hydrate] Add existing session:", session._id);
            this.addSession(session, "existing");
        }

        this.pickNextSession();
    }

    /**
     * Get the currently selected session
     * @returns Active Session
     */
    @computed get activeSession() {
        return this.sessions.get(this.current!);
    }

    /**
     * Get the currently ready client
     * @returns Ready Client
     */
    @computed get readyClient() {
        const session = this.activeSession;
        return session && session.ready ? session.client! : undefined;
    }

    /**
     * Get an unauthenticated instance of the Revolt.js Client
     * @returns API Client
     */
    @computed get anonymousClient() {
        return this.apiClient!
    }

    /**
     * Get the next available client (either from session or API)
     * @returns Revolt.js Client
     */
    @computed get availableClient() {
        return this.activeSession?.client ?? this.apiClient!;
    }

    /**
     * Fetch server configuration
     * @returns Server Configuration
     */
    @computed get serverConfig() {
        return this.configuration;
    }
    
    /**
     * Start a new client lifecycle
     * @param entry Session Information
     * @param knowledge Whether the session is new or existing
     */
    @action addSession(
        session: SessionPrivate,
        knowledge: "new" | "existing",
    ) {
        const user_id = session.user_id!;
        const sessionController = new Session();
        this.sessions.set(user_id, sessionController);
        this.loggedIn.set(true);
        console.debug("[addSession] Session set! Check reactive changes", this.sessions.size);
        sessionController
            .emit({
                action: "LOGIN",
                session,
                configuration: this.configuration!,
                knowledge,
            }).then(() => {
                this.pickNextSession();
            })
            .catch((err) => {
                const error = takeError(err);
                if (error == "Forbidden" || error == "Unauthorized") {
                    this.sessions.delete(user_id);
                    this.current = null;
                    this.pickNextSession();
                    auth.removeSession(user_id);
                    if (user_id == this.current) {
                        modalController.push({ type: "signed_out" });
                    }
                    sessionController.destroy();
                } else {
                    modalController.push({
                        type: "error",
                        error,
                    });
                }
            });
            sessionController.state.subscribe((state) => this.ready.set(state == "Ready"));
    }

    /**
     * Login given a set of credentials
     * @param credentials Credentials
     */
    async login(credentials: API.DataLogin) {
        const browser = detect();

        // Generate a friendly name for this browser
        let friendly_name;
        if (browser) {
            let { name } = browser;
            const { os } = browser;
            let isiPad;
            // @ts-ignore
            if (window.isNative) {
                friendly_name = `Revolt Desktop on ${os}`;
            } else {
                if (name === "ios") {
                    name = "safari";
                } else if (name === "fxios") {
                    name = "firefox";
                } else if (name === "crios") {
                    name = "chrome";
                }
                if (os === "Mac OS" && navigator.maxTouchPoints > 0)
                    isiPad = true;
                friendly_name = `${name} on ${isiPad ? "iPadOS" : os}`;
            }
        } else {
            friendly_name = "Unknown Device";
        }

        // Try to login with given credentials
        let session = await this.apiClient!.api.post("/auth/session/login", {
            ...credentials,
            friendly_name,
        });

        // Prompt for MFA verificaiton if necessary
        if (session.result === "MFA") {
            const { allowed_methods } = session;
            while (session.result === "MFA") {
                const mfa_response: API.MFAResponse | undefined =
                    await new Promise((callback) =>
                        modalController.push({
                            type: "mfa_flow",
                            state: "unknown",
                            available_methods: allowed_methods,
                            callback,
                        }),
                    );

                if (!mfa_response) {
                    break;
                }

                try {
                    session = await this.apiClient!.api.post(
                        "/auth/session/login",
                        {
                            mfa_response,
                            mfa_ticket: session.ticket,
                            friendly_name,
                        },
                    );
                } catch (err) {
                    console.error("Failed login:", err);
                }
            }

            if (session.result === "MFA") {
                throw "Cancelled";
            }
        }

        // Start client lifecycle
        this.addSession(
            session as never,
            "new",
        );
    }

    /**
     * Log out of a specific user session
     * @param user_id Target User ID
     */
    @action logout(user_id: string) {
        const session = this.sessions.get(user_id);
        if (session) {
            // Safe logout
            session.emit({ action: "LOGOUT" });

            if (this.sessions.delete(user_id)) {
                auth.removeSession(user_id);
                console.debug("Session %s deleted", user_id);
            } else {
                console.warn("No sessions deleted");
            }

            settings.reset();
            notificationsStore.reset();

            if (user_id == this.current) {
                this.current = null;
                this.loggedIn.set(false);
                this.ready.set(false);
            }

            this.pickNextSession();
        }
    }
    /**
     * Logout of the current session
     */
    @action logoutCurrent() {
        if (this.current) {
            this.logout(this.current);
        }
    }

    @action switchAccount(user_id: string | null) {
        this.current = user_id;
        //this.ready.set(user_id != null);
        console.log('account switched to', user_id);
    }
}

export const clientController = new ClientController;
/**
 * Get the currently active session.
 * @returns Session
 */
export function useSession() {
    return clientController.activeSession
}

/**
 * Get the currently active client or an unauthorised
 * client for API requests, whichever is available.
 * @returns Revolt.js Client
 */
export function useClient() {
    return clientController.availableClient
}

/**
 * Get unauthorised client for API requests.
 * @returns Revolt.js Client
 */
export function useApi() {
    return clientController.anonymousClient.api
}