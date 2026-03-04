import { autorun } from "mobx";
import type { Channel, Server, ServerMember, User } from "stoat.js";
import { writable, type Writable } from "svelte/store";

export type MemberListGroup = {
    type: "online" | "offline" | "role" | "no_offline";
    name?: string;
    members: ServerMember[];
};

export type UserListGroup = {
    type: "online" | "offline";
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

export function fetchMembers(channel: Channel, getMembers: () => Promise<ServerMember[]>) {
    let entries: Writable<MemberListGroup[]> = writable([]);
    function sort(keys: ServerMember[]) {
        const categories: { [key: string]: ServerMember[] } = {
            online: [],
            offline: [],
        };
        const categoryInfo: { [key: string]: string } = {};
        let roles: Server["orderedRoles"] | undefined;
        let roleIds: Set<string>;

        // Order roles (by ranking)
        if (channel.server) {
            roles = channel.server.orderedRoles;
            if (roles) {
                const hoistedRoles = roles.filter((role) => role.hoist);
                for (const role of hoistedRoles) {
                    if (categories[role.id]) {
                        continue;
                    }
                    categories[role.id] = [];
                    categoryInfo[role.id] = role.name;
                }
                roleIds = new Set(hoistedRoles.map((role) => role.id));
            }
        }

        // Assign each member to a category
        keys.forEach((member) => {
            if (member.user?.online) {
                // Sort users into hoisted roles here.
                if (member?.roles) {
                    const roleId = member.roles.find(role => roleIds.has(role));
                    if (roleId) {
                        categories[roleId].push(member);
                    } else {
                        categories.online.push(member);
                    }
                }
            } else {
                categories.offline.push(member);
            }
        });

        
        Object.keys(categories).forEach((key) =>
            categories[key].sort((a, b) =>
          (a.nickname ?? a.user?.displayName)?.localeCompare(
            b.nickname ?? b.user?.displayName ?? "",
          ) || 0),
        );

        const temp_entries: MemberListGroup[] = [];

        Object.keys(categoryInfo).forEach((key) => {
            if (categories[key].length > 0) {
                temp_entries.push({
                    type: "role",
                    name: categoryInfo[key],
                    members: categories[key],
                });
            }
        });

        if (categories.online.length) {
            temp_entries.push({
                type: "online",
                members: categories.online,
            });
        }

        if (shouldSkipOffline(categories.offline.length)) {
            temp_entries.push({
                type: "no_offline",
                members: [null!],
            });
        } else if (categories.offline.length) {
            temp_entries.push({
                type: "offline",
                members: categories.offline,
            });
        }
        entries.set(temp_entries);
    }

    autorun(() => getMembers().then((members) => sort(members)).catch((err)=>{
        console.warn(err);
    }));
    return entries;
}

export function fetchRecipients(getRecipients: () => User[]) {
    const entries: Writable<UserListGroup[]> = writable([]);
    function sort(users: User[]) {
        const categories: { [key: string]: User[] } = {
            online: [],
            offline: [],
        };

        users.forEach((user) => {
            if (user.online) {
                categories.online.push(user);
            } else {
                categories.offline.push(user);
            }
        });

        Object.keys(categories).forEach((key) =>
            categories[key].sort((a, b) => a.displayName.localeCompare(b.displayName)),
        );

        const temp_entries: UserListGroup[] = [];

        if (categories.online.length) {
            temp_entries.push({
                type: "online",
                users: categories.online,
            });
        }

        if (!shouldSkipOffline(categories.offline.length)) {
            temp_entries.push({
                type: "offline",
                users: categories.offline,
            });
        }

        entries.set(temp_entries);
    }

    autorun(() => sort(getRecipients()));
    return entries;
}