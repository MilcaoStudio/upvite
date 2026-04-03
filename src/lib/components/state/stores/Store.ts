import { writable, type Writable } from "svelte/store";

export abstract class BaseStore<T> {
    protected store: Writable<T>;

    constructor(initialValue?: T){
        this.store = writable(initialValue);
    }

    /**
     * Updates this store to the provided value
     */
    abstract hydrate(value: T): void;

    /**
     * Updates this store to a default value
     */
    abstract reset(): void;

    get subscribe() {
        return this.store.subscribe;
    }
}

export class MapStore<K,V> extends Map<K,V> {
    private store: Writable<this>
    constructor(entries?: Iterable<readonly [K, V]>){
        super(entries);
        this.store = writable(this);
        this.store.subscribe(this.onUpdate);
    }

    set(key: K, value: V){
        this.store.update(self =>{super.set(key, value); return self});
        return this;
    }

    clear() {
        this.store.update(self => {super.clear(); return self});
    }

    onUpdate(self: this){
        for (const [key, value] of self.entries()) {
            console.log(key, value);
        }
    }
}