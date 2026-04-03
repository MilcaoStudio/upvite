<script lang="ts">
    import { getRenderer } from "$lib/rendered/Singleton.svelte";
    import type { Channel } from "stoat.js";
    import Bar from "./Bar.svelte";
    import { internalEmit } from "$lib/InternalEmitter";
    import { t } from "svelte-i18n";
    import BxDownArrowAlt from "svelte-boxicons/BxDownArrowAlt.svelte";

    interface Props {
        channel: Channel;
    }

    let { channel }: Props = $props();
    let renderer = $derived(getRenderer(channel));
</script>

{#if renderer.state == "RENDER" && !renderer.atBottom}
    <Bar position="bottom">
        <button
            onclick={() => {
                renderer.jumpToBottom(true);
                internalEmit("NewMessages", "hide");
            }}
        >
            <div>
                {$t("app.main.channel.misc.viewing_old")}
            </div>
            <div class="right">
                <span>{$t("app.main.channel.misc.jump_present")}</span>
                <BxDownArrowAlt size={18} />
            </div>
        </button>
    </Bar>
{/if}
