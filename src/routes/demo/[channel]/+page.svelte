<script lang="ts">
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import { useClient } from "$lib/components/mock/MockClient";
    import MockServerTextChannel from "$lib/components/mock/MockServerTextChannel.svelte";
    import type { PageData } from "./$types";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
    const client = useClient();
    let channel = $derived(client.channels.get(data.channel_id));
</script>

{#if channel}
    <UprisingApp>
        <MockServerTextChannel {channel} />
    </UprisingApp>
{/if}
