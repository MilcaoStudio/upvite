<script lang="ts">
    import { run } from 'svelte/legacy';

    import { getRenderer } from "$lib/rendered/Singleton";
    import type { Channel, Message } from "stoat.js";
    import Reply from "./Reply.svelte";
    import BxReply from "svelte-boxicons/BxReply.svelte";
    import { t } from "svelte-i18n";
    import UserShort from "$lib/components/user/UserShort.svelte";
    import BxFile from "svelte-boxicons/BxFile.svelte";
    import Markdown from "$lib/markdown/Markdown.svelte";
    import { state } from "$lib/State";
    import { useClient } from "$lib/controllers/ClientController";

    interface Props {
        index: number;
        channel?: Channel | undefined;
        id: string;
        mentions: string[];
    }

    let {
        index,
        channel = undefined,
        id,
        mentions
    }: Props = $props();
    let view = $derived(channel && getRenderer(channel, state));
    let message: Message | undefined = $state();
    let client = useClient();

    run(() => {
        const msg = client.messages.get(id);
        if (msg) {
            message = msg;
        } else {
            channel?.fetchMessage(id).then((_message) => (message = _message));
        }
    });

    if (view?.state == "RENDER") {
    }
</script>

{#if message}
    <Reply head={!index}>
        {#if message.author?.relationship == "Blocked"}
            {$t("app.main.channel.misc.blocked_user")}
        {:else if message.authorId == "00000000000000000000000000"}
            <!--TODO: system message-->
            <div></div>
        {:else}
            <div class="user">
                <UserShort
                    size={14}
                    showServerIdentity
                    user={message.author}
                    masquerade={message.masquerade}
                    prefixAt={mentions.includes(message.authorId || "")}
                />
            </div>
            <a class="content" href={message.path}>
                {#if message.attachments}
                    <BxFile size={16} />
                    <em>
                        {message.attachments.length > 1
                            ? $t("app.main.channel.misc.sent_multiple_files")
                            : $t("app.main.channel.misc.sent_file")}
                    </em>
                {/if}
                {#if message.content}
                    <Markdown content={message.content.replace(/\n/g, " ")} />
                {/if}
            </a>
        {/if}
    </Reply>
{:else}
    <Reply head={!index} fail>
        <BxReply size={16} />
        <span>{$t("app.main.channel.misc.failed_load")}</span>
    </Reply>
{/if}

<style>
    .user {
        flex-shrink: 0;
    }
    .content {
        white-space: nowrap;
    }
    .content :global(*) {
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>