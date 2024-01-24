/**
 * A data store which is persistent and should cache its data locally.
 */
export default interface Persistent<T> {

    get id(): string
    
    /**
     * Serialise this data store.
     */
    toJSON(): unknown;

    /**
     * Hydrate this data store using given data.
     * @param data Given data
     */
    hydrate(data: T, revision: number): void;
}