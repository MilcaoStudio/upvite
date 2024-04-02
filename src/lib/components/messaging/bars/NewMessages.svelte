<script lang="ts">
    import { internalSubscribe } from "$lib/InternalEmitter";
    import { getRenderer } from "$lib/rendered/Singleton";
    import { dayjs } from "$lib/i18n";
    import type { Channel } from "revolt.js";
    import { decodeTime } from "ulid";
    import Bar from "./Bar.svelte";
    import { goto } from "$app/navigation";
    import { translate } from "$lib/i18n";
    import { t } from "svelte-i18n";
    import BxUpArrowAlt from "svelte-boxicons/BxUpArrowAlt.svelte";
    import { state } from "$lib/State";


    export let channel: Channel, lastId: string | undefined = undefined;
    let hidden = false, timeAgo = '';
    function hide(){hidden=true}
    $: lastId && (hidden=false);
    internalSubscribe("NewMessages", "hide", hide);
    function onKeyDown(e: KeyboardEvent) {
        e.key == "Escape" && hide()
    }

    $: if (lastId) {
        try {
            timeAgo = (dayjs(decodeTime(lastId)) as any).fromNow() as string;
        } catch (err) {}
    }

    const renderer = getRenderer(channel, state);
</script>

<svelte:document on:keydown={onKeyDown} />

{#if renderer.state == "RENDER" && lastId && !hidden}
    <Bar position="top" accent>
        <button on:click={()=>{
            hidden = true;
            if (channel.channel_type == "TextChannel") {
                goto(`/server/${channel.server_id}/channel/${channel._id}/${lastId}`)
            } else {
                goto(`/channel/${channel._id}/${lastId}`)
            }
        }}>
            <div>{translate("app.main.channel.misc.new_messages", {time_ago: timeAgo})}</div>
            <div class="right">
                <span>{$t('app.main.channel.misc.jump_beginning')}</span>
                <BxUpArrowAlt size={20} />
            </div>
        </button>
    </Bar>
{/if}