import type { Modal } from "$lib/types/Modal";
import { ulid } from "ulid";

export class ModalController<T extends Modal> {
    stack: T[] = [];
    components: any;

    constructor(components: any) {
        this.components = components;

        this.close = this.close.bind(this);
    }

    /**
     * Display a new modal on the stack
     * @param modal Modal data
     */
    push(modal: T) {
        this.stack = [
            ...this.stack,
            {
                ...modal,
                key: ulid(),
            },
        ];
    }

    /**
     * Remove the top modal from the screen
     * @param signal What action to trigger
     */
    pop(signal: "close" | "confirm" | "force") {
        this.stack = this.stack.map((entry, index) =>
            index === this.stack.length - 1 ? { ...entry, signal } : entry,
        );
    }

    /**
     * Close the top modal
     */
    close() {
        this.pop("close");
    }

    /**
     * Remove the keyed modal from the stack
     */
    remove(key: string) {
        this.stack = this.stack.filter((x) => x.key !== key);
    }

    /**
     * Whether a modal is currently visible
     */
    get isVisible() {
        return this.stack.length > 0;
    }
}

export const modalController = new ModalController([]);