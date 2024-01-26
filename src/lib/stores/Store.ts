import { writable, type Writable } from "svelte/store";

export class CollectionStore<T> {
    private state: Writable<T[]>;
    collection: T[];
    constructor(items?: T[]){
        this.collection = items ?? [];
        this.state = writable(this.collection);
        this.state.subscribe(this.onUpdate.bind(this));
    }

    push(item: T) {
        this.state.update(items => [...items, item]);
    }

    remove(target: T){
        this.state.update(items => {
            const i = items.findIndex(item => item == target);
            items.splice(i, 1);
            return items;
        });
    }

    removeIf(condition: (item: T)=>boolean){
        this.state.update(items=>items.filter(condition));
    }

    onUpdate(items: T[]){
        console.log('onUpdate - ', items);
        this.collection = items;
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