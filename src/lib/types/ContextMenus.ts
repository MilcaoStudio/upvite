import type { SvelteNode } from "$lib/markdown/runtime/svelteRuntime";
import type { QueuedMessage } from "$lib/stores/MessageQueue";
import type { NotificationState } from "$lib/stores/NotificationOptions";
import type { Message, API, Channel, Server, User, Member } from "revolt.js";

export interface ContextMenuData {
    user?: string;
    server?: string;
    server_list?: string;
    channel?: string;
    message?: Message;
    attachment?: API.File;

    unread?: boolean;
    queued?: QueuedMessage;
    contextualChannel?: string;
    contextualMessage?: string;
}

export type Action =
    | { action: "copy_id"; id: string }
    | { action: "admin"; id: string; type: "channel" | "message" | "user" }
    | { action: "admin_system"; id: string }
    | { action: "copy_message_link"; message: Message }
    | { action: "copy_selection" }
    | { action: "copy_text"; content: string }
    | { action: "mark_as_read"; channel: Channel }
    | { action: "mark_server_as_read"; server: Server }
    | { action: "mark_unread"; message: Message }
    | { action: "retry_message"; message: QueuedMessage }
    | { action: "cancel_message"; message: QueuedMessage }
    | { action: "mention"; user: string }
    | { action: "reply_message"; target: Message }
    | { action: "quote_message"; content: string }
    | { action: "edit_message"; id: string }
    | { action: "delete_message"; target: Message }
    | { action: "open_file"; attachment: API.File }
    | { action: "save_file"; attachment: API.File }
    | { action: "copy_file_link"; attachment: API.File }
    | { action: "open_link"; link: string }
    | { action: "copy_link"; link: string }
    | { action: "make_owner"; channel: Channel; user: User }
    | { action: "remove_member"; channel: Channel; user: User }
    | { action: "kick_member"; target: Member }
    | { action: "ban_member"; target: Member }
    | { action: "view_profile"; user: User }
    | { action: "message_user"; user: User }
    | { action: "block_user"; user: User }
    | { action: "unblock_user"; user: User }
    | { action: "add_friend"; user: User }
    | { action: "remove_friend"; user: User }
    | { action: "cancel_friend"; user: User }
    | { action: "set_presence"; presence: API.Presence }
    | { action: "set_status" }
    | { action: "clear_status" }
    | { action: "create_channel"; target: Server }
    | { action: "create_category"; target: Server }
    | {
          action: "create_invite";
          target: Channel;
      }
    | { action: "leave_group"; target: Channel }
    | {
          action: "delete_channel";
          target: Channel;
      }
    | { action: "close_dm"; target: Channel }
    | { action: "leave_server"; target: Server }
    | { action: "delete_server"; target: Server }
    | { action: "edit_identity"; target: Member }
    | {
          action: "open_notification_options";
          channel?: Channel;
          server?: Server;
      }
    | { action: "open_settings" }
    | { action: "open_channel_settings"; id: string }
    | { action: "open_server_settings"; id: string }
    | { action: "open_server_channel_settings"; server: string; id: string }
    | {
          action: "set_notification_state";
          key: string;
          state?: NotificationState;
      }
    | { action: "report"; target: User | Server | Message; messageId?: string };


