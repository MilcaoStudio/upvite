<script lang="ts">
    import TextSvelte from "$lib/i18n/TextSvelte.svelte";
    import Markdown from "$lib/markdown/Markdown.svelte";
    import { createElement } from "$lib/markdown/runtime/svelteRuntime";
    import { TextSystemMessage, User, UserSystemMessage, type Message } from "stoat.js";
    import UserShort from "../user/UserShort.svelte";
    import MessageBase from "./MessageBase.svelte";
    import MessageInfo from "./MessageInfo.svelte";
    import MessageDetail from "./MessageDetail.svelte";
    import Info from "svelte-boxicons/BxInfoCircle.svelte";
    import Edit from "svelte-boxicons/BxEdit.svelte";
    import UserPlus from "svelte-boxicons/BxUserPlus.svelte";
    import UserMinus from "svelte-boxicons/BxUserMinus.svelte";
    import Key from "svelte-boxicons/BxKey.svelte";
    import { decodeTime } from "ulid";
    import Row from "../atoms/layout/Row.svelte";
    import Tooltip from "../atoms/Tooltip.svelte";
    import { useState } from "../state/StateContext.svelte";

    const weekMs = 1000 * 60 * 60 * 24 * 7;
    const Icons: Record<string, ConstructorOfATypedSvelteComponent> = {
        channel_ownership_changed: Key,
        user_added: UserPlus,
        user_remove: UserMinus,
        channel_renamed: Edit,
        text: Info,
    };
    interface Props {
        message: Message;
        highlight?: boolean;
        hideInfo?: boolean;
    }

    let { message, highlight = false, hideInfo = false }: Props = $props();
    // I don't have time for fixing this
    let data = $derived(message.systemMessage as any);
    let createdAt =
        $derived(data?.type == "user_joined"
            ? decodeTime((data as UserSystemMessage).userId)
            : null);
    let settings = useState().settings;
</script>

{#if data}
    {#snippet user()}
        <UserShort user={data.user} />
    {/snippet}
    {#snippet byUser()}
        <UserShort user={data.by}/>
    {/snippet}
    {#snippet fromUser()}
        <UserShort user={data.from} />
    {/snippet}
    {#snippet toUser()}
        <UserShort user={data.to} />
    {/snippet}
    {#snippet channelName()}
        <strong>{data.name}</strong>
    {/snippet}
    <MessageBase {highlight}>
        {#if !hideInfo}
            <MessageInfo click={false}>
                <MessageDetail {message} position="left" />
                {@const Icon = Icons[data.type] ?? Info}
                <Icon />
            </MessageInfo>
        {/if}
        <div class="SystemContent">
            {#if data.type == "text"}
                <Markdown content={data.content} />
            {:else if data.type == "channel_description_changed" || data.type == "channel_icon_changed"}
                <TextSvelte
                    id="app.main.channel.system.{data.type}"
                    fields={{
                        user: byUser,
                    }}
                />
            {:else if data.type == "channel_ownership_changed"}
                <TextSvelte
                    id="app.main.channel.system.channel_ownership_changed"
                    fields={{
                        from: fromUser,
                        to: toUser,
                    }}
                />
            {:else if data.type == "channel_renamed"}
                <TextSvelte
                    id="app.main.channel.system.channel_renamed"
                    fields={{
                        user: byUser,
                        name: channelName,
                    }}
                />
            {:else if data.type == "user_added"}
                
                <TextSvelte
                    id="app.main.channel.system.added_by"
                    fields={{
                        user,
                        other_user: byUser,
                    }}
                />
            {:else if data.type == "user_banned" || data.type == "user_left" || data.type == "user_kicked"}
                <Row centred>

                    <TextSvelte
                        id="app.main.channel.system.{data.type}"
                        fields={{
                            user,
                        }}
                    />
                </Row>
            {:else if data.type == "user_joined"}
                <Row centred>
                    <TextSvelte
                        id="app.main.channel.system.{data.type}"
                        fields={{
                            user,
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
                        user,
                        other_user: byUser,
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
