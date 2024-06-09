import { autorun } from "mobx";
import type { API, Channel, Server, User } from "revolt.js";
import { writable, type Writable } from "svelte/store";
import { useClient } from "./controllers/ClientController";

export type MemberListGroup = {
    type: "online" | "offline" | "role" | "no_offline";
    name?: string;
    users: User[];
};

// Whether globally skip offline members. 
let globalSkipOffline = false;
const skipThreshold = 50;

/**
 * 
 * @param offline_count Offline member count from server/group
 * @returns Whether skip offline members
 */
export function shouldSkipOffline(offline_count: number) {
    return globalSkipOffline || offline_count > skipThreshold;
}

export function fetchMembers(channel: Channel, getKeys: ()=>string[], isServer?: boolean) {
    const client = useClient();
    let entries: Writable<MemberListGroup[]> = writable([]);
    function sort(keys: string[]) {
        const categories: { [key: string]: [User, string][] } = {
            online: [],
            offline: [],
        };
        const categoryInfo: { [key: string]: string } = {};
        let roles: Server["roles"] | undefined;
        let roleList: string[];
        if (
            channel.type == "TextChannel" ||
            channel.type == "VoiceChannel"
        ) {
            roles = channel.server?.roles;
            if (roles) {
                const list = [...roles.entries()].map(([id, role]) => [id, role, role.rank ?? 0] as [string, API.Role, number]);
                list.sort((b, a) => b[2] - a[2]);

                list.forEach(([id, role]) => {
                    if (categories[id]) return;
                    categories[id] = [];
                    categoryInfo[id] = role.name;
                });

                roleList = list.map((x) => x[0]);
            }
        }

        keys.forEach((key) => {
            let u;
            if (isServer) {
                const { server, user } = JSON.parse(key);
                if (server != channel.serverId) return;
                u = client.users.get(user);
            } else {
                u = client.users.get(key);
            }

            if (!u) return;

            const member = client.serverMembers.get(key);
            const sort = member?.nickname ?? u.username;
            const entry = [u, sort] as [User, string];

            if (!u.online || u.status?.presence == "Invisible") {
                categories.offline.push(entry);
            } else {
                if (isServer) {
                    // Sort users into hoisted roles here.
                    if (member?.roles && roles) {
                        let success = false;
                        for (const role of roleList) {
                            if (member.roles.includes(role)) {
                                categories[role].push(entry);
                                success = true;
                                break;
                            }
                        }

                        if (success) return;
                    }
                } else {
                    // Sort users into "participants" list here.
                    // For voice calls.
                }

                categories.online.push(entry);
            }
        });

        Object.keys(categories).forEach((key) =>
            categories[key].sort((a, b) => a[1].localeCompare(b[1])),
        );

        const temp_entries: MemberListGroup[] = [];

        Object.keys(categoryInfo).forEach((key) => {
            if (categories[key].length > 0) {
                temp_entries.push({
                    type: "role",
                    name: categoryInfo[key],
                    users: categories[key].map((x) => x[0]),
                });
            }
        });

        if (categories.online.length) {
            temp_entries.push({
                type: "online",
                users: categories.online.map((x) => x[0]),
            });
        }

        if (shouldSkipOffline(categories.offline.length)) {
            temp_entries.push({
                type: "no_offline",
                users: [null!],
            });
        } else if (categories.offline.length) {
            temp_entries.push({
                type: "offline",
                users: categories.offline.map((x) => x[0]),
            });
        }

        entries.set(temp_entries);
    }

    autorun(() => sort(getKeys()));
    return entries;
}