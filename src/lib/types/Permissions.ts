import type { API, Server } from "revolt.js";

export type RoleOrDefault = (
    | API.Role
    | {
          name: string;
          permissions: number;
          colour?: string;
          hoist?: boolean;
          rank?: number;
      }
) & { id: string };

export function getRoles(server: Server): RoleOrDefault[] {
    return [...server.orderedRoles, {
        id: "default",
        name: "Default",
        permissions: server.defaultPermissions,
    }]
}