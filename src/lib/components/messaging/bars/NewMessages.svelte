<script lang="ts">
    import { internalSubscribe } from "$lib/InternalEmitter";
    import { dayjs } from "$lib/components/context/Locale.svelte"
    import type { Channel } from "revolt.js";
    import { decodeTime } from "ulid";

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
</script>

<svelte:document on:keydown={onKeyDown} />

<div></div>