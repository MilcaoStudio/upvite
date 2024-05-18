<script lang="ts">
    import type { Channel } from "revolt.js";
    import PermissionsLayout from "../permissions/PermissionsLayout.svelte";

    export let channel: Channel;
</script>

<PermissionsLayout {channel} />