/**
 * A data store which syncs data to Revolt.
 */
export default interface Syncable {
    get id(): string;
    apply(key: string, data: unknown, revision: number): void;
    toSyncable(): { [key: string]: object };
}