import { faker } from "@faker-js/faker";
import { Client, DEFAULT_PERMISSION_SERVER, type API, type Channel, type Member, type User } from "revolt.js";
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
}].map(c => client.channels.createObj(c));

client.user = client.users.createObj({
    _id: "01J0EX4S6623T1JTVEAXDZTQBV",
    username: "official_tester",
    online: true,
    relationship: "User",
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
console.debug("Fake user client registered, id:", client.user!._id);
export const servers = [client.servers.createObj({
    _id: server_id,
    channels: channels.map(c => c._id),
    default_permissions: DEFAULT_PERMISSION_SERVER,
    name: "TEST",
    owner: "01J0EXEAJW7KJ3YM984PZBT0H6"
})];

export function createMockClient() {

    for (let i = 0; i < user_ids.length; i++) {
        const online = i % 2 == 0;
        client.users.createObj({
            _id: user_ids[i],
            username: faker.person.firstName(),
            online,
            status: {
                presence: "Busy",
                text: faker.company.buzzPhrase(),
            }
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
        yield client.messages.createObj({
            _id: ulid(),
            channel,
            author,
            content: faker.company.catchPhrase(),
            nonce: ulid(),
        });
    }
    return client.messages.createObj({
        system: { type: "text", content: "Limit for message generation has been reached" },
        _id: ulid(),
        author: "00000000000000000000000000",
        channel,
    });
}

export function mockFetchMessagesWithUsers(channel: Channel, options: API.MessageQuery) {
    const messageGen = generateMessage(channel._id);
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
    const members = [...new Set(messages.map(msg => client.members.getKey({ server: server_id, user: msg.author?._id ?? "" })).filter(author => author) as Member[])];
    return Promise.resolve({
        messages,
        users,
        members
    })
}