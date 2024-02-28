import { passThroughComponents } from "./plugins/remarkRegex";
import { timestampHandler } from "./plugins/timestamps";

export const handlers = {
    ...passThroughComponents("emoji", "spoiler", "mention", "channel"),
    timestamp: timestampHandler,
};