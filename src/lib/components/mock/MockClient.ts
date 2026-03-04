import { faker } from "@faker-js/faker";
import { Client, DEFAULT_PERMISSION_SERVER, type API, type Channel, type ServerMember, type User } from "stoat.js";
import { ulid } from "ulid";

const server_id = "01J0ERKYEA7A1S0K95W4C78FAS";
const user_ids = ["01J0EXEAJW7KJ3YM984PZBT0H6", "01J0EXEAJX4A7PHYGS8FM3SQV1", "01J0EXEAJXSCEMDX2VEYJC29AE",
    "01J0EXEAJYX40XM6RNQ75H53S5", "01J0EXEAJYZ91WNNZZG2SMN8WZ", "01J0EXEAJYD9QPWDFKNTG6BRQ6", "01J0EXEAJY4RX7H1MAQFWA3J1C", "01J0EXEAJYZPSPHX4DYG6CZD7D"]
const client = new Client();
export const channels = [{
    name: "Off Topic",
    _id: "01J0ERNR74BZ3F7STG052A6JDF",
    channel_type: "TextChannel" as "TextChannel",
    server: server_id,
    description: "This channel is not connected to any API",
}].map(c => client.channels.getOrCreate(c._id, c));

client.user = client.users.getOrCreate("01J0EX4S6623T1JTVEAXDZTQBV",{
    _id: "01J0EX4S6623T1JTVEAXDZTQBV",
    username: "official_tester",
    online: true,
    relationship: "User",
    discriminator: "0000",
    badges: 0b11111111111,
    //avatar:
    //profile:
    relations: [
        { _id: "01J0EXEAJW7KJ3YM984PZBT0H6", status: "Friend" },
        { _id: "01J0EXEAJX973WRQ199NY38S88", status: "Friend" },
        { _id: "01J0EXEAJX4A7PHYGS8FM3SQV1", status: "Friend" },
        { _id: "01J0EXEAJXSCEMDX2VEYJC29AE", status: "Incoming" },
        { _id: "01J0EXEAJYX40XM6RNQ75H53S5", status: "Incoming" },
        { _id: "01J0EXEAJYZ91WNNZZG2SMN8WZ", status: "Outgoing" },
        { _id: "01J0EXEAJYD9QPWDFKNTG6BRQ6", status: "Outgoing" },
        { _id: "01J0EXEAJY4RX7H1MAQFWA3J1C", status: "Blocked" },
        { _id: "01J0EXEAJYZPSPHX4DYG6CZD7D", status: "Blocked" },
    ],
    status: {
        text: "Exploring this amazing app",
        presence: "Online"
    }
});
console.debug("Fake user client registered, id:", client.user!.id);
export const servers = [client.servers.getOrCreate(server_id, {
    _id: server_id,
    channels: channels.map(c => c.id),
    default_permissions: Number(DEFAULT_PERMISSION_SERVER),
    name: "TEST",
    owner: "01J0EXEAJW7KJ3YM984PZBT0H6"
})];

export function createMockClient() {

    for (let i = 0; i < user_ids.length; i++) {
        const online = i % 2 == 0;
        client.users.getOrCreate(user_ids[i], {
            _id: user_ids[i],
            discriminator: faker.number.int({min: 0, max: 9999}).toString(),
            username: faker.person.firstName(),
            online,
            status: {
                presence: "Busy",
                text: faker.company.buzzPhrase(),
            },
            relationship: "None",
        })
    }

    console.debug(client.users.size, "fake users registered");
    
}

export function useClient() {
    return client;
}

function* generateMessage(channel: string) {
    for (let i = 0; i < 5_000; i++) {
        const author = user_ids[Math.floor(Math.random() * user_ids.length)];
        const id = ulid();
        yield client.messages.getOrCreate(id, {
            _id: id,
            channel,
            author,
            content: faker.company.catchPhrase(),
            nonce: ulid(),
        });
    }
    const messageId = ulid();
    return client.messages.getOrCreate(messageId, {
        system: { type: "text", content: "Limit for message generation has been reached" },
        _id: messageId,
        author: "00000000000000000000000000",
        channel,
    });
}

export function mockFetchMessagesWithUsers(channel: Channel, options: API.DataMessageSearch) {
    const messageGen = generateMessage(channel.id);
    const limit = options.limit || 50;
    const messages = [];
    for (let i = 0; i < limit; i++) {
        const next = messageGen.next();
        messages.push(next.value);
        if (next.done) {
            break;
        }
    }
    const users = [...new Set(messages.map(msg => msg.author).filter(author => author) as User[])];
    const members = [...new Set(messages.map(msg => client.serverMembers.getByKey({ server: server_id, user: msg.authorId ?? "" })).filter(author => author) as ServerMember[])];
    return Promise.resolve({
        messages,
        users,
        members
    })
}