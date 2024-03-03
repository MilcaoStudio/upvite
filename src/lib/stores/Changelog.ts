import { modalController } from "$lib/components/modals/ModalController";
import type { SvelteElement } from "$lib/markdown/runtime/svelteRuntime";
import type Persistent from "$lib/types/Persistent";
import type Syncable from "$lib/types/Syncable";
import { action, makeAutoObservable, runInAction } from "mobx";

export interface Data {
    viewed?: number;
}

type Element =
    | string
    | {
          type: "image";
          src: string;
          shadow?: boolean;
      }
    | { type: "element"; element: SvelteElement };

export interface ChangelogPost {
    date: Date;
    title: string;
    content: Element[];
}

export const changelogEntries: Record<number, ChangelogPost> = {
    1: {
        date: new Date("2024-03-03T20:39:16.674Z"),
        title: "Markdown enabled",
        content: [
            "We have markdown in message contents",
        ],
    },
};

export const changelogEntryArray = Object.keys(changelogEntries).map(
    (index) => changelogEntries[parseInt(index)],
);

export const latestChangelog = changelogEntryArray.length;
/**
 * Keeps track of viewed changelog items
 */
export default class Changelog implements Persistent<Data>, Syncable {
    /**
     * Last viewed changelog ID
     */
    private viewed: number;

    /**
     * Construct new Layout store.
     */
    constructor() {
        this.viewed = 0;
        makeAutoObservable(this);
    }

    get id() {
        return "changelog";
    }

    toJSON() {
        return {
            viewed: this.viewed,
        };
    }

    @action hydrate(data: Data) {
        if (data.viewed) {
            this.viewed = data.viewed;
        }
    }

    apply(_key: string, data: unknown, _revision: number): void {
        this.hydrate(data as Data);
    }

    toSyncable(): { [key: string]: object } {
        return {
            changelog: this.toJSON(),
        };
    }

    /**
     * Check whether there are new updates
     */
    checkForUpdates() {
        if (this.viewed < latestChangelog) {
            const expires = new Date(+changelogEntries[latestChangelog].date);
            expires.setDate(expires.getDate() + 7);

            if (+new Date() < +expires) {
                if (latestChangelog == 3) {
                    modalController.push({
                        type: "changelog_usernames",
                    });
                } else {
                    modalController.push({
                        type: "changelog",
                        initial: latestChangelog,
                    });
                }
            }

            runInAction(() => {
                this.viewed = latestChangelog;
            });
        }
    }
}