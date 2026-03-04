<script lang="ts">
    import { getContext } from "svelte";
    import type { Message } from "stoat.js";
    import { decodeTime } from "ulid";
    import Tooltip from "../atoms/Tooltip.svelte";
    import { t } from "svelte-i18n";
    import { dayjs, type Dictionary } from "$lib/i18n";

    interface Props {
        message: Message;
        position: "left" | "top";
    }

    let { message, position }: Props = $props();
    const dict = getContext<Dictionary>("dictionary");
</script>

{#if position == "left" && dict}
    {#if message.editedAt}
        <time class="copyTime">
            <i class="copyBracket">[</i>
            {dayjs(decodeTime(message.id)).format(dict.dayjs?.timeFormat)}
            <i class="copyBracket">]</i>
        </time>
        <span class="edited">
            <Tooltip content={dayjs(message.editedAt).format("LLLL")}
                >{$t("app.main.channel.edited")}</Tooltip
            >
        </span>
    {:else}
        <time>
            <i class="copyBracket">[</i>
            {dayjs(decodeTime(message.id)).format(
                dict.dayjs?.timeFormat || "HH:mm",
            )}
            <i class="copyBracket">]</i>
        </time>
    {/if}
{:else}
    <div class="Detail">
        <time>{dayjs(decodeTime(message.id)).calendar()}</time>
        {#if message.editedAt}
            <Tooltip content={dayjs(message.editedAt).format("LLLL")}>
                <span class="edited">
                    {$t("app.main.channel.edited")}
                </span>
            </Tooltip>
        {/if}
    </div>
{/if}

<style>
    div.Detail {
        flex-shrink: 0;
        gap: 4px;
        font-size: 10px;
        display: inline-flex;
        color: var(--tertiary-foreground);
    }

    div.Detail .edited {
        cursor: default;
    }

    div.Detail .edited::selection {
        background-color: transparent;
        color: var(--tertiary-foreground);
    }
</style>
