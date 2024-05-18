export function load({params}) {
    return {
        channel: params.channel,
        tab: params.tab,
        server: params.server,
    }
}