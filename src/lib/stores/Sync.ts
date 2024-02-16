export type SyncKeys =
    | "theme"
    | "appearance"
    | "locale"
    | "notifications"
    | "ordering"
    | "changelog"
    | "plugins";

export interface Data {
    disabled: SyncKeys[];
    revision: {
        [key: string]: number;
    };
}