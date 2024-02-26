<script lang="ts">
    import { useClient } from "$lib/controllers/ClientController";
    import { PersonPicture } from "fluent-svelte";
    import type { Server } from "revolt.js";

    export let target: Server | null = null, attachment: any = undefined, size: number, animate = false, server_name = '';
    const client = useClient();
    const iconURL = client.generateFileURL(
        target?.icon ?? attachment ?? undefined,
        { max_side: 256 },
        animate,
    );

    const name = target?.name ?? server_name;
</script>

<PersonPicture class="ServerText" src={iconURL} alt={name} {size} {...$$restProps} />