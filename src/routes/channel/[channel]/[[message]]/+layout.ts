export function load({ params }) {
    return {
        channel_id: params.channel,
        message_id: params.message,
    }
}