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

<style>
    .ServerText {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.2em;
        font-size: 0.75rem;
        font-weight: 600;
        overflow: hidden;
        color: var(--foreground);
        background: var(--primary-background);
        border-radius: var(--border-radius-half);
    }
</style>