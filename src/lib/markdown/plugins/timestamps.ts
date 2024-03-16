import type { Handler } from "mdast-util-to-hast";

import { createComponent } from "./remarkRegex";
import { dayjs } from "$lib/i18n";

export const timestampHandler: Handler = (s, { match, arg1 }) => {
    if (isNaN(match)) return { type: "text", value: match };
    const date = dayjs.unix(match);

    let value = "";
    switch (arg1) {
        case "t":
            value = date.format("hh:mm");
            break;
        case "T":
            value = date.format("hh:mm:ss");
            break;
        case "R":
            //value = date.fromNow();
            break;
        case "D":
            value = date.format("DD MMMM YYYY");
            break;
        case "F":
            value = date.format("dddd, DD MMMM YYYY hh:mm");
            break;
        default:
            value = date.format("DD MMMM YYYY hh:mm");
            break;
    }

    return {type: "element", tagName: "code", properties: {}, children: [{ type: "text", value }]}
};

export const remarkTimestamps = createComponent(
    "timestamp",
    /<t:([0-9]+)(?::(\w))?>/g,
);