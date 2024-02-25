import type { CancelTokenSource } from "axios";
import type { Channel, User } from "revolt.js";

export type UploadState =
        | { type: "none" }
        | { type: "attached"; files: File[] }
        | {
              type: "uploading";
              files: File[];
              percent: number;
              cancel: CancelTokenSource;
          }
        | { type: "sending"; files: File[] }
        | { type: "failed"; files: File[]; error: string };
// ! FIXME: add to app config and load from app config
export const CAN_UPLOAD_AT_ONCE = 5;

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