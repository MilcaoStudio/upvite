// TODO: include this in revolt.js lib
declare type Session = {
    _id?: string;
    token: string;
    name: string;
    user_id: string;
};

declare type SessionPrivate = Session;