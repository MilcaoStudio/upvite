<script lang="ts">
    import type { Server } from "revolt.js";
    import PermissionsLayout from "../permissions/PermissionsLayout.svelte";
    export let server: Server;
</script>

<PermissionsLayout {server} />
