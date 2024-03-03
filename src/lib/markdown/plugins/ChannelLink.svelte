<script lang="ts">
    import { clientController } from "$lib/controllers/ClientController";

    export let match: string;
    $: channel = clientController.availableClient.channels.get(match)
</script>

<a href={channel?.path} >
    #{channel?.name}
</a>