<script lang="ts">
    import { clientController } from "$lib/controllers/ClientController";

    interface Props {
        match: string;
    }

    let { match }: Props = $props();
    let channel = $derived(clientController.availableClient?.channels.get(match))
</script>

<a href={channel?.path} >
    #{channel?.name}
</a>