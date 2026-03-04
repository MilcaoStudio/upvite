import type { ImageEmbed, MessageEmbed, TextEmbed, VideoEmbed, WebsiteEmbed } from "stoat.js";

export function isImageEmbed(embed: MessageEmbed): embed is ImageEmbed {
    return embed.type == "Image";
}
export function isVideoEmbed(embed: MessageEmbed): embed is VideoEmbed {
    return embed.type == "Video";
}
export function isWebsiteEmbed(embed: MessageEmbed): embed is WebsiteEmbed {
    return embed.type == "Website";
}
export function isTextEmbed(embed: MessageEmbed): embed is TextEmbed {
    return embed.type == "Text";
}