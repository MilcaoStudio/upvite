import type { Channel, User } from "revolt.js";

export type UploadState =
        | { type: "none" }
        | { type: "attached"; files: File[] }
        | {
              type: "uploading";
              files: File[];
              percent: number;
              cancel: AbortController;
          }
        | { type: "sending"; files: File[] }
        | { type: "failed"; files: File[]; error: string };
// ! FIXME: add to app config and load from app config
export const CAN_UPLOAD_AT_ONCE = 5;
export const ATTACHMENT_SIZE_LIMIT = 20_000_000;

export type AutoCompleteState =
    | { type: "none" }
    | ({ selected: number; within: boolean } & (
            {
                type: "user";
                matches: User[];
            }
          | {
                type: "channel";
                matches: Channel[];
            }
));

export type SearchClues = {
    users?: { type: "channel"; id: string } | { type: "all" };
    channels?: { server: string };
};

/**
 * Category of emoji
 */
export type EmojiCategory = {
    id: string;
    name: string;
    emoji?: string;
    iconURL?: string;
};

/**
 * Emoji information
 */
export type EmojiInfo = {
    id: string;
    name?: string;
};

/**
 * Generated information from query and given categories / emojis
 */
export type EmojiTable = {
    /**
     * Emoji items
     */
    items: EmojiInfo[][];

    /**
     * Emoji count for each category
     */
    categoryCounts: number[];

    /**
     * Currently visible categories
     */
    activeCategories: EmojiCategory[];
};