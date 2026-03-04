<script lang="ts">
    import type { Server } from "stoat.js";
    import PermissionsLayout from "../permissions/PermissionsLayout.svelte";
    interface Props {
        server: Server;
    }

    let { server }: Props = $props();
</script>

<PermissionsLayout {server} />
