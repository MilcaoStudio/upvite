<script lang="ts">
    import type { Server } from "stoat.js";
    import PermissionsLayout from "../permissions/PermissionsLayout.svelte";
    export let server: Server;
</script>

<PermissionsLayout {server} />
