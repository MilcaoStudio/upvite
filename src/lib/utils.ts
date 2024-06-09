import type { API, Client } from "revolt.js";

export async function setSyncSettings(
    client: Client,
    data: { [key: string]: object | string },
    timestamp?: number,
) {
    const requestData: { [key: string]: string } = {};
    for (const key of Object.keys(data)) {
        const value = data[key];
        requestData[key] =
            typeof value == "string" ? value : JSON.stringify(value);
    }
    await client.account.setSettings(requestData, timestamp);
}

/**
     * Log out of Revolt. Disconnect the WebSocket, request a session invalidation and reset the client.
     */
export async function logout(client: Client,avoidRequest?: boolean) {
    !avoidRequest && (await client.api.post("/auth/session/logout"));
}

/**
     * Log in with auth data, creating a new session in the process.
     * @param details Login data object
     * @returns An on-boarding function if on-boarding is required, undefined otherwise
     */
export async function APILogin(client: Client, details: API.DataLogin) {
    const data = await client.api.post("/auth/session/login", details);
    if (data.result == "Success") {
        return data;
    } else {
        throw "MFA not implemented!";
    }
}