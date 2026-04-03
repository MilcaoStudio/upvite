<script lang="ts">
    import { useClient } from "$lib/components/client/ClientContext.svelte";

    const client = useClient();
    interface Props {
        match: string;
    }

    let { match }: Props = $props();
    let channel = $derived(client.channels.get(match))
</script>

<a href={channel?.path} >
    #{channel?.name}
</a>