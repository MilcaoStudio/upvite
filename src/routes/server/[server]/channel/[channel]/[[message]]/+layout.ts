export function load({ params }) {
    return {
        channel: params.channel,
        server: params.server,
        message: params.message
    }
}