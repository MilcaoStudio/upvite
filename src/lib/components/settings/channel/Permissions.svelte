<script lang="ts">
    import type { Channel } from "stoat.js";
    import PermissionsLayout from "../permissions/PermissionsLayout.svelte";

    interface Props {
        channel: Channel;
    }

    let { channel }: Props = $props();
</script>

<PermissionsLayout {channel} />