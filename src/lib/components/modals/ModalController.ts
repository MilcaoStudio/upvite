import type { Modal } from "$lib/types/Modal";
import { ulid } from "ulid";
import UserProfile from "./UserProfile.svelte";
import Onboarding from "./Onboarding.svelte";
import { action, computed, makeObservable, observable } from "mobx";
import { injectWindow } from "$lib";

export class ModalController<T extends Modal> {
    @observable stack: T[] = [];

    constructor(public components: Record<string, SvelteComponentConstructor<any, any>>) {

        makeObservable(this);
        this.close = this.close.bind(this);
        injectWindow('modalController', this)
    }

    /**
     * Display a new modal on the stack
     * @param modal Modal data
     */
    @action push(modal: T) {
        this.stack = [
            ...this.stack,
            {
                ...modal,
                key: ulid(),
            },
        ];
        console.log('[ModalController.ts] modal pushed', modal.type);
    }

    /**
     * Remove the top modal from the screen
     * @param signal What action to trigger
     */
    @action pop(signal: "close" | "confirm" | "force") {
        this.stack = this.stack.map((entry, index) =>
            index == this.stack.length - 1 ? { ...entry, signal } : entry,
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
    @action remove(key: string) {
        this.stack = this.stack.filter((x) => x.key != key);
    }

    /**
     * Whether a modal is currently visible
     */
    @computed get isVisible() {
        return this.stack.length > 0;
    }
}

export const modalController = new ModalController({
    onboarding: Onboarding,
    user_profile: UserProfile,
});