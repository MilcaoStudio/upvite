<script lang="ts">
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import { useClient } from "$lib/components/mock/MockClient";
    import MockServerTextChannel from "$lib/components/mock/MockServerTextChannel.svelte";

    interface Props {
        data: any;
    }

    let { data }: Props = $props();
    let channel = useClient().channels.get(data.channel_id);
</script>

{#if channel}
    <UprisingApp>
        <MockServerTextChannel {channel} />
    </UprisingApp>
{/if}
