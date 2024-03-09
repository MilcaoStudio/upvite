<script lang="ts">
    import { getRenderer } from "$lib/rendered/Singleton";
    import type { Channel } from "revolt.js";
    import Bar from "./Bar.svelte";
    import { internalEmit } from "$lib/InternalEmitter";
    import { t } from "svelte-i18n";
    import { BxDownArrowAlt } from "svelte-boxicons";

    export let channel: Channel;
    let renderer = getRenderer(channel);
</script>

{#if renderer.state == "RENDER" && !renderer.atBottom}
    <Bar position="bottom">
        <button
            on:click={() => {
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
