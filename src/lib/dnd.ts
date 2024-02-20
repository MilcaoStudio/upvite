import type { DndEvent } from "svelte-dnd-action";

export function useCustomReorder<T>(setItems: (items: T[])=>void) {
    return function(evt: CustomEvent<DndEvent<T>>) {
        const items: T[] = evt.detail.items;
        setItems(items);
    }
}

export function reorder<T>(list: T[]) {
    return list
}