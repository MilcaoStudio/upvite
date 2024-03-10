import type { Modal } from "$lib/types/Modal";
import { ulid } from "ulid";
import UserProfile from "./UserProfile.svelte";
import Onboarding from "./Onboarding.svelte";
import { action, computed, makeObservable, observable } from "mobx";
import { injectWindow } from "$lib";
import CreateServer from "./CreateServer.svelte";
import { determineLink } from "$lib/links";
import { state } from "$lib/State";
import { goto } from "$app/navigation";
import Confirmation from "./Confirmation.svelte";
import ClipboardModal from "./ClipboardModal.svelte";
import LinkWarning from "./LinkWarning.svelte";
import DeleteMessage from "./DeleteMessage.svelte";

export class ModalController {
    @observable stack: Modal[] = [];

    constructor(public components: Record<string, SvelteComponentConstructor<any, any>>) {

        makeObservable(this);
        this.close = this.close.bind(this);
        injectWindow('modalController', this)
    }

    /**
     * Display a new modal on the stack
     * @param modal Modal data
     */
    @action push(modal: Modal) {
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

    /**
     * Write text to the clipboard
     * @param text Text to write
     */
    writeText(text: string) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            this.push({type: "clipboard", text});
        }
    }
    /**
     * Safely open external or internal link
     * @param href Raw URL
     * @param trusted Whether we trust this link
     * @param mismatch Whether to always open link warning
     * @returns Whether to cancel default event
     */
    openLink(href?: string, trusted?: boolean, mismatch?: boolean) {
        const link = determineLink(href);
        const settings = state.settings;

        if (mismatch) {
            if (href) {
                modalController.push({
                    type: "link_warning",
                    link: href,
                    callback: () => this.openLink(href, true) as true,
                });
            }

            return true;
        }

        switch (link.type) {
            case "navigate": {
                goto(link.path);
                break;
            }
            case "external": {
                if (
                    !trusted &&
                    !settings.security.isTrustedOrigin(link.url.hostname)
                ) {
                    modalController.push({
                        type: "link_warning",
                        link: link.href,
                        callback: () => this.openLink(href, true) as true,
                    });
                } else {
                    window.open(link.href, "_blank", "noreferrer");
                }
            }
        }

        return true;
    }
}

export const modalController = new ModalController({
    block_user: Confirmation,
    clipboard: ClipboardModal,
    close_dm: Confirmation,
    create_server: CreateServer,
    delete_bot: Confirmation,
    delete_channel: Confirmation,
    delete_message: DeleteMessage,
    delete_server: Confirmation,
    link_warning: LinkWarning,
    onboarding: Onboarding,
    unfriend_user: Confirmation,
    user_profile: UserProfile,
});