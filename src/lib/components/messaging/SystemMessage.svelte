<script lang="ts">
    import { state } from "$lib/State";
    import TextSvelte from "$lib/i18n/TextSvelte.svelte";
    import Markdown from "$lib/markdown/Markdown.svelte";
    import { createElement } from "$lib/markdown/runtime/svelteRuntime";
    import type { Message } from "revolt.js";
    import UserShort from "../user/UserShort.svelte";
    import MessageBase from "./MessageBase.svelte";
    import MessageInfo from "./MessageInfo.svelte";
    import MessageDetail from "./MessageDetail.svelte";
    import Info from "svelte-boxicons/BxInfoCircle.svelte";
    export let message: Message,
        highlight = false,
        hideInfo = false;
    $: data = message.asSystemMessage;
    let settings = state.settings;
</script>

{#if data}
    <MessageBase {highlight}>
        {#if !hideInfo}
            <MessageInfo click={false}>
                <MessageDetail {message} position="left" />
                <Info class="systemIcon" />
            </MessageInfo>
        {/if}
        <div class="SystemContent">
            {#if data.type == "text"}
                {#if message.system?.type == "text"}
                    <Markdown content={message.system.content} />
                {/if}
            {:else if data.type == "channel_description_changed" || data.type == "channel_icon_changed"}
                <TextSvelte
                    id="app.main.channel.system.{data.type}"
                    fields={{
                        user: createElement(UserShort, { user: data.by }),
                    }}
                />
            {:else if data.type == "channel_renamed"}
                <TextSvelte
                    id="app.main.channel.system.channel_renamed"
                    fields={{
                        user: createElement(UserShort, { user: data.by }),
                        name: createElement("strong", null, data.name),
                    }}
                />
            {:else}
                <span>{data.type}</span>
            {/if}
        </div>
    </MessageBase>
{/if}

<style>
    .SystemContent {
        gap: 4px;
        display: flex;
        padding: 2px 0;
        flex-wrap: wrap;
        align-items: center;
        flex-direction: row;
        font-size: 14px;
        color: var(--secondary-foreground);
    }
</style>
