<script lang="ts">
    import type { Channel } from "stoat.js";
    import PermissionsLayout from "../permissions/PermissionsLayout.svelte";

    export let channel: Channel;
</script>

<PermissionsLayout {channel} />