<script lang="ts">
    import type {
        EmojiCategory,
        EmojiInfo,
        EmojiTable,
    } from "$lib/types/messaging";
    import { css, cx } from "@emotion/css";
    import { observable } from "mobx";
    import Column from "../layout/Column.svelte";
    import InputBox from "$lib/components/form/InputBox.svelte";
    import Emoji from "$lib/markdown/plugins/Emoji.svelte";
    import { PersonPicture } from "fluent-svelte";

    const ROW_SIZE = 8;
    const Base = cx(
        "Picker",
        css`
            user-select: none;
            padding: 0 .5rem;

            // row width + scrollbar + group selector
            width: calc(${ROW_SIZE} * 40px + 20px + 40px);
            height: 420px;
            background: var(--secondary-background);

            max-width: calc(100vw - 20px);
            max-height: calc(75vh);
            border-radius: var(--border-radius);
        `,
    );
    const EmojiContainer = cx(
        "EmojiContainer",
        css`
            padding: 0;
            display: grid;
            place-items: center;
            background: transparent;

            width: 40px;
            height: 40px;

            cursor: pointer;
            transition: 0.1s ease all;
            border-radius: var(--border-radius);
            border: unset;

            &:hover {
                background: var(--tertiary-background);
            }

            &:active {
                filter: brightness(0.9);
            }

            img {
                width: 28px;
                height: 28px;
                object-fit: contain;
            }
        `,
    );

    export let categories: EmojiCategory[],
        emojis: Record<string | "default", EmojiInfo[]>,
        onSelect: (emoji: string) => void = function () {};
    // Take a ref of container
    let ref: HTMLDivElement | null = null;
    let baseRef = null;
    // Keep track of user queries
    let query = "";
    // Keep track of "active" emoji (on hover)
    let active: { emoji: EmojiInfo | null } = observable({ emoji: null });
    function sliceArray<T>(array: T[], size: number): T[][] {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }

    let scrollTopTarget: any = null;
    let timeoutRef: number | null = null;

    let scrollCallback: (params: {
        scrollTop: number;
        scrollHeight: number;
        viewportHeight: number;
    }) => void = function () {};
    function onScroll(ev: Event) {
        const el = ev.target as HTMLElement;
        const windowScroll = (el as any) == window || (el as any) == document;
        let scrollTop: number | null = windowScroll
            ? window.scrollY || document.documentElement.scrollTop
            : el.scrollTop;
        const scrollHeight = windowScroll
            ? document.documentElement.scrollHeight
            : el.scrollHeight;
        const viewportHeight = windowScroll
            ? window.innerHeight
            : el.offsetHeight;
        const call = () =>
            scrollCallback({
                scrollTop: Math.max(scrollTop || 0, 0),
                scrollHeight,
                viewportHeight,
            });
        call();
        if (scrollTopTarget) {
            if (
                scrollTop === scrollTopTarget ||
                scrollTop <= 0 ||
                scrollTop == scrollHeight - viewportHeight
            ) {
                scrollTop = null;
                if (timeoutRef) {
                    clearTimeout(timeoutRef);
                    timeoutRef = null;
                }
            }
        }
    }

    function fetchEmojis() {
        // Prepare query
        const q = query.trim().toLowerCase();

        // Prepare data structures
        const items: EmojiInfo[][] = [];
        const activeCategories: EmojiCategory[] = [];
        const categoryCounts: number[] = [];
        for (const cat of categories) {
            let append = emojis[cat.id] ?? [];

            if (q) {
                // TODO: implement better algorithm
                append = append.filter((emoji) =>
                    emoji.name ? emoji.name.includes(q) : emoji.id.includes(q),
                );

                if (!append.length) {
                    continue;
                }
            }

            // Slice emoji collection into chunks of maximum length of ROW_SIZE
            const categoryEmojis = sliceArray(append, ROW_SIZE);

            items.push(...categoryEmojis);
            activeCategories.push(cat);
            categoryCounts.push(categoryEmojis.length);
        }

        return {
            items,
            categoryCounts,
            activeCategories,
        };
    }

    let generated: EmojiTable = {
        items: [],
        categoryCounts: [],
        activeCategories: [],
    };
    $: {
        query;
        emojis;
        categories;
        generated = fetchEmojis();
    }
</script>

<Column class={Base} gap="0" bind:this={baseRef}>
    <Column class="controls">
        <InputBox
            autoFocus
            value={query}
            onChange={(e) => (query = e.currentTarget.value)}
            placeholder="Type to search..."
        />
    </Column>
    <div class="container">
        <div class="scroller" on:scroll={onScroll}>
            {#each generated.items as row, i}
                <div class="row" data-index={i}>
                    {#each row as item}
                        <button
                            class={EmojiContainer}
                            on:click={() => onSelect(item.id)}
                            on:focus={() => (active.emoji = item)}
                            on:mouseover={() => (active.emoji = item)}
                        >
                            <Emoji match={item.id} />
                        </button>
                    {/each}
                </div>
            {/each}
        </div>
        <div class="group">
            {#each generated.activeCategories as cat}
                <button
                    class={EmojiContainer}
                    on:click={() => ref?.scrollIntoView({ behavior: "smooth" })}
                >
                    <div class="category icon">
                        {#if cat.emoji}
                            <div>
                                <Emoji match={cat.emoji} />
                            </div>
                        {:else}
                            <PersonPicture size={24} src={cat.iconURL} />
                        {/if}
                    </div>
                </button>
            {/each}
        </div>
    </div>
    {#if active.emoji}
        <div class="EmojiPreview">
            <Emoji match={active.emoji.id} />
            <span>:{active.emoji.name ?? active.emoji.id}:</span>
        </div>
    {/if}
</Column>

<style>
    .scroller {
        height: 100%;
        outline: none;
        overflow: hidden auto;
        position: relative;
        flex-grow: 1;
        padding: 0px 2px;
    }

    .container {
        flex-grow: 1;
        min-height: 0;
        display: flex;
        flex-direction: row;
    }

    .group {
        width: 40px;
        scrollbar-width: none;

        background: var(--secondary-background);
        border-start-start-radius: var(--border-radius);
    }

    .group::-webkit-scrollbar {
        width: 0px;
    }

    .row {
        display: flex;
    }

    .category {
        display: flex;
        align-items: center;
        background: var(--background);
    }

    .category.icon {
        display: grid;
        place-items: center;

        width: 40px;
        height: 40px;

        user-select: none;
        pointer-events: none;
        filter: brightness(0.75);
    }
/*
    .category .name {
        width: 100%;
        padding: 0 0.2em;
        text-align: left;
        color: var(--foreground);
        filter: brightness(0.75);
    }
*/
    .EmojiPreview {
        gap: 8px;
        padding: 8px;
        display: flex;
        align-items: center;
        flex-direction: row;

        color: var(--foreground);
        border-top: 3px solid var(--background);
    }

    .EmojiPreview :global(img) {
        width: 48px;
        height: 48px;
        object-fit: contain;
    }
</style>
