import type { Server } from "stoat.js";

export type RoleOrDefault = (
    {
        name: string;
        permissions: {
            a: bigint;
            d: bigint;
        } | bigint;
        colour?: string | null;
        hoist?: boolean;
        rank?: number;
        id: string;
    }
);

export function getRoles(server: Server): RoleOrDefault[] {
    const roles = server.orderedRoles.map(({permissions, ...data}) => (
        {
            permissions: {
                a: permissions.a,
                d: permissions.d,
            },
            ...data
        }
    ));
    return [...roles, {
        id: "default",
        name: "Default",
        permissions: server.defaultPermissions,
    }]
}