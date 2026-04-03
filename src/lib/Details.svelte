<script lang="ts">
    import { css, cx } from "@emotion/css";
    import type { Snippet } from "svelte";
    import type { HTMLDetailsAttributes } from "svelte/elements";

    interface Props extends HTMLDetailsAttributes {
        sticky?: boolean;
        large?: boolean;
        open?: boolean;
        summary?: Snippet<[]>,
        children?: Snippet<[]>,
    }

    let {
        sticky = false,
        large = false,
        open = false,
        children,
        summary,
        ...rest
    }: Props = $props();
    const Details = cx('Details', css`
        summary {
            outline: none;
            cursor: pointer;
            list-style: none;
            user-select: none;
            align-items: center;
            transition: 0.2s opacity;

            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;

            &::marker,
            &::-webkit-details-marker {
                display: none;
            }

            .title {
                flex-grow: 1;
                margin-top: 1px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }

            .padding {
                > svg {
                    flex-shrink: 0;
                    margin-inline-end: 4px;
                    transition: 0.2s ease transform;
                }
            }

            gap: 4px;
            display: flex;
            align-items: center;
        }

        &:not([open]) {
            summary {
                opacity: 0.7;
            }

            summary svg {
                transform: rotateZ(-90deg);
            }
        }
    `);
</script>

<details class={Details} {open} {...rest}>
    {#if summary}
        <summary class={{sticky, large}}>
            <div class="padding">
                {@render summary()}
            </div>
        </summary>
    {:else}
        {@render children?.()}
    {/if}
</details>

<style>
    .sticky {
        top: -1px;
        z-index: 10;
        position: sticky;
    }

    .large {
        background: var(--primary-background);
        color: var(--secondary-foreground);
    }

    .padding {
        /*TOFIX: make this applicable only for the friends list menu, DO NOT REMOVE.*/
        display: flex;
        align-items: center;
        padding: 5px 0;
        margin: 0.8em 0px 0.4em;
        cursor: pointer;
    }
</style>