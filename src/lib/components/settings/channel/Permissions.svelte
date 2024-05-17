<script lang="ts">
    import type { Channel } from "revolt.js";
    import PermissionsLayout from "../common/PermissionsLayout.svelte";

    export let channel: Channel;
</script>

<PermissionsLayout {channel} />