import { Client, type API } from "revolt.js";
import { modalController } from "../components/modals/ModalController";
import type Auth from "$lib/stores/Auth";
import { detect } from "detect-browser";
import { env } from "$env/dynamic/public"
import { state } from "$lib/State";
import { injectWindow, takeError } from "$lib";
import { ObservableMap, action, computed, makeAutoObservable, observable } from "mobx";
import { browser } from "$app/environment";
import { voiceState } from "$lib/voice/VoiceState";
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
        | "SUCCESS"
        | "DISCONNECT"
        | "RETRY"
        | "LOGOUT"
        | "ONLINE"
        | "OFFLINE";
    };

export default class Session {
    state: SessionState = navigator.onLine ? "Ready" : "Offline";
    user_id: string | null = null;
    client: Client | null = null;

    /**
     * Create a new Session
     */
    constructor() {
        makeAutoObservable(this);
        this.onDropped = this.onDropped.bind(this);
        this.onReady = this.onReady.bind(this);
        this.onOnline = this.onOnline.bind(this);
        this.onOffline = this.onOffline.bind(this);

        window.addEventListener("online", this.onOnline);
        window.addEventListener("offline", this.onOffline);
    }
    /**
     * Initiate logout and destroy client
     */
    @action destroy() {
        if (this.client) {
            this.client.logout(false);
            this.state = "Ready";
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

    /**
     * Called when the client signals it has received the Ready packet
     */
    private onReady() {
        //resetMemberSidebarFetched();
        this.emit({
            action: "SUCCESS",
        });
    }

    /**
     * Create a new Revolt.js Client for this Session
     * @param apiUrl Optionally specify an API URL
     */
    private createClient(apiUrl?: string) {
        this.client = new Client({
            unreads: true,
            autoReconnect: false,
            onPongTimeout: "EXIT",
            apiURL: apiUrl ?? env.PUBLIC_API_URL,
        });

        this.client.addListener("dropped", this.onDropped);
        this.client.addListener("ready", this.onReady);
    }

    /**
     * Destroy the client including any listeners.
     */
    private destroyClient() {
        this.client!.removeAllListeners();
        this.client!.logout();
        this.user_id = null;
        this.client = null;
    }

    /**
     * Ensure we are in one of the given states
     * @param state Possible states
     */
    private assert(...state: SessionState[]) {
        let found = false;
        for (const target of state) {
            if (this.state === target) {
                found = true;
                break;
            }
        }

        if (!found) {
            throw `State must be ${state} in order to transition! (currently ${this.state})`;
        }
    }

    /**
     * Continue logging in provided onboarding is successful
     * @param data Transition Data
     */
    private async continueLogin(data: Transition & { action: "LOGIN" }) {
        try {
            await this.client!.useExistingSession(data.session);
            this.user_id = this.client!.user!._id;
            state.auth.setSession(data.session);
            voiceState.loadVoice(this.client!);
        } catch (err) {
            this.state = "Ready";
            throw err;
        }
    }

    /**
     * Transition to a new state by a certain action
     * @param data Transition Data
     */
    @action async emit(data: Transition) {
        console.info(`[FSM ${this.user_id ?? "Anonymous"}]`, data);

        switch (data.action) {
            // Login with session
            case "LOGIN": {
                this.assert("Ready");
                this.state = "Connecting";
                this.createClient(data.apiUrl);

                if (data.configuration) {
                    this.client!.configuration = data.configuration;
                }

                if (data.knowledge === "new") {
                    await this.client!.fetchConfiguration();
                    this.client!.session = data.session;
                    (this.client! as any).$updateHeaders();

                    const { onboarding } = await this.client!.api.get(
                        "/onboard/hello",
                    );

                    if (onboarding) {
                        modalController.push({
                            type: "onboarding",
                            callback: async (username: string) =>
                                this.client!.completeOnboarding(
                                    { username },
                                    false,
                                ).then(() => this.continueLogin(data)),
                        });

                        return;
                    }
                }

                await this.continueLogin(data);
                break;
            }
            // Ready successfully received
            case "SUCCESS": {
                this.assert("Connecting");
                this.state = "Online";
                break;
            }
            // Client got disconnected
            case "DISCONNECT": {
                if (navigator.onLine) {
                    this.assert("Online");
                    this.state = "Disconnected";

                    setTimeout(() => {
                        // Check we are still disconnected before retrying.
                        if (this.state === "Disconnected") {
                            this.emit({
                                action: "RETRY",
                            });
                        }
                    }, 1000);
                }

                break;
            }
            // We should try reconnecting
            case "RETRY": {
                this.assert("Disconnected");
                this.client!.websocket.connect();
                this.state = "Connecting";
                break;
            }
            // User instructed logout
            case "LOGOUT": {
                this.assert("Connecting", "Online", "Disconnected");
                this.state = "Ready";
                this.destroyClient();
                break;
            }
            // Browser went offline
            case "OFFLINE": {
                this.state = "Offline";
                break;
            }
            // Browser went online
            case "ONLINE": {
                this.assert("Offline");
                if (this.client) {
                    this.state = "Disconnected";
                    this.emit({
                        action: "RETRY",
                    });
                } else {
                    this.state = "Ready";
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

    /**
     * User ID of active session
     */
    private current: string | null;

    constructor() {
        if (browser) {
            if (!env.PUBLIC_API_URL) {
                throw ReferenceError("PUBLIC_API_URL environment variable is undefined. PUBLIC_API_URL is mandatory for client controller.");
            }

            this.apiClient = new Client({
                apiURL: env.PUBLIC_API_URL,
            });

            this.apiClient
                .fetchConfiguration()
                .then(() => (this.configuration = this.apiClient!.configuration!));
        }

        this.configuration = null;
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
    @action hydrate(auth: Auth) {
        for (const entry of auth.accounts) {
            this.addSession(entry, "existing");
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

    @computed get isLoggedIn() {
        return !!this.current
    }
    /**
     * Check whether we are currently ready
     * @returns Whether we are ready to render
     */
    @computed get isReady() {
        return this.activeSession?.ready;
    }

    /**
     * Start a new client lifecycle
     * @param entry Session Information
     * @param knowledge Whether the session is new or existing
     */
    @action addSession(
        entry: { session: SessionPrivate; apiUrl?: string },
        knowledge: "new" | "existing",
    ) {
        const user_id = entry.session.user_id!;

        const session = new Session();
        this.sessions.set(user_id, session);
        this.pickNextSession();

        session
            .emit({
                action: "LOGIN",
                session: entry.session,
                apiUrl: entry.apiUrl,
                configuration: this.configuration!,
                knowledge,
            })
            .catch((err) => {
                const error = takeError(err);
                if (error === "Forbidden" || error === "Unauthorized") {
                    this.sessions.delete(user_id);
                    this.current = null;
                    this.pickNextSession();
                    state.auth.removeSession(user_id);
                    modalController.push({ type: "signed_out" });
                    session.destroy();
                } else {
                    modalController.push({
                        type: "error",
                        error,
                    });
                }
            });
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
            {
                session: session as never,
            },
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
            if (user_id === this.current) {
                this.current = null;
            }

            this.sessions.delete(user_id);
            this.pickNextSession();
            session.destroy();
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

    @action switchAccount(user_id: string) {
        this.current = user_id;
        console.log('account switched to', user_id);

        // This will allow account switching to work more seamlessly,
        // maybe it'll be properly / fully implemented at some point.
        // resetMemberSidebarFetched();
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