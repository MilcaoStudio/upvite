<script lang="ts">
    import { internalSubscribe } from "$lib/InternalEmitter";
    import { getRenderer } from "$lib/rendered/Singleton.svelte";
    import { dayjs } from "$lib/i18n";
    import type { Channel } from "stoat.js";
    import { decodeTime } from "ulid";
    import Bar from "./Bar.svelte";
    import { goto } from "$app/navigation";
    import { translate } from "$lib/i18n";
    import { t } from "svelte-i18n";
    import BxUpArrowAlt from "svelte-boxicons/BxUpArrowAlt.svelte";

    interface Props {
        channel: Channel;
        lastId?: string | undefined;
    }

    let { channel, lastId = undefined }: Props = $props();
    let hidden = $state(false), timeAgo = $state('');
    function hide(){
        hidden=true
    }
    $effect(() => {
        if (lastId) {
            try {
                hidden = false;
                timeAgo = (dayjs(decodeTime(lastId)) as any).fromNow() as string;
            } catch (err) {}
        }
    });
    internalSubscribe("NewMessages", "hide", hide);
    function onKeyDown(e: KeyboardEvent) {
        e.key == "Escape" && hide()
    }

    const renderer = $derived(getRenderer(channel));
</script>

<svelte:document onkeydown={onKeyDown} />

{#if renderer.state == "RENDER" && lastId && !hidden}
    <Bar position="top" accent>
        <button onclick={()=>{
            hidden = true;
            if (channel.type == "TextChannel") {
                goto(`/server/${channel.serverId}/channel/${channel.id}/${lastId}`)
            } else {
                goto(`/channel/${channel.id}/${lastId}`)
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