<script lang="ts">
    import { state } from "$lib/State";
    import TextSvelte from "$lib/i18n/TextSvelte.svelte";
    import Markdown from "$lib/markdown/Markdown.svelte";
    import { createElement } from "$lib/markdown/runtime/svelteRuntime";
    import { User, type Message } from "revolt.js";
    import UserShort from "../user/UserShort.svelte";
    import MessageBase from "./MessageBase.svelte";
    import MessageInfo from "./MessageInfo.svelte";
    import MessageDetail from "./MessageDetail.svelte";
    import Info from "svelte-boxicons/BxInfoCircle.svelte";
    import Edit from "svelte-boxicons/BxEdit.svelte";
    import UserPlus from "svelte-boxicons/BxUserPlus.svelte";
    import UserMinus from "svelte-boxicons/BxUserMinus.svelte";
    import Key from "svelte-boxicons/BxKey.svelte";
    import type { ComponentType } from "svelte";
    import { decodeTime } from "ulid";
    import Row from "../atoms/layout/Row.svelte";
    import Tooltip from "../atoms/Tooltip.svelte";

    const weekMs = 1000 * 60 * 60 * 24 * 7;
    const Icons: Record<string, ComponentType> = {
        channel_ownership_changed: Key,
        user_added: UserPlus,
        user_remove: UserMinus,
        channel_renamed: Edit,
        text: Info,
    };
    export let message: Message,
        highlight = false,
        hideInfo = false;
    $: data = message.asSystemMessage;
    $: createdAt =
        data.type == "user_joined" && data.user
            ? decodeTime(data.user._id)
            : null;
    let settings = state.settings;
</script>

{#if data}
    <MessageBase {highlight}>
        {#if !hideInfo}
            <MessageInfo click={false}>
                <MessageDetail {message} position="left" />
                <svelte:component this={Icons[data.type] ?? Info} />
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
            {:else if data.type == "channel_ownership_changed"}
                <TextSvelte
                    id="app.main.channel.system.channel_ownership_changed"
                    fields={{
                        from: createElement(UserShort, { user: data.from }),
                        to: createElement(UserShort, { user: data.to }),
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
            {:else if data.type == "user_added"}
                <TextSvelte
                    id="app.main.channel.system.added_by"
                    fields={{
                        user: createElement(UserShort, { user: data.user }),
                        other_user: createElement(UserShort, { user: data.by }),
                    }}
                />
            {:else if data.type == "user_banned" || data.type == "user_left" || data.type == "user_kicked"}
                <Row centred>
                    <TextSvelte
                        id="app.main.channel.system.{data.type}"
                        fields={{
                            user: createElement(UserShort, { user: data.user }),
                        }}
                    />
                </Row>
            {:else if data.type == "user_joined"}
                <Row centred>
                    <TextSvelte
                        id="app.main.channel.system.{data.type}"
                        fields={{
                            user: createElement(UserShort, { user: data.user }),
                        }}
                    />
                    {#if createdAt && (settings.get("appearance:show_account_age") || Date.now() - createdAt < weekMs)}
                        <Tooltip i18n="app.main.channel.system.registered_at">
                            <Info size={16} />
                        </Tooltip>
                    {/if}
                </Row>
            {:else if data.type == "user_remove"}
                <TextSvelte
                    id="app.main.channel.system.removed_by"
                    fields={{
                        user: createElement(UserShort, { user: data.user }),
                        other_user: createElement(UserShort, { user: data.by }),
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
