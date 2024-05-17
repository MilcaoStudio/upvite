<script lang="ts">
    import type { Channel } from "revolt.js";
    import EditorForChannel from "./RoleEditorForChannel.svelte";

    export let channel: Channel | undefined = undefined,
        server = channel?.server;
    let selected = "default";
</script>

{#if server}
    <div class="PermissionsLayout">
        <!-- TODO: server / channel in server layout-->
    </div>
{:else if channel}
    <EditorForChannel {selected} {channel} />
{/if}

<style>
    .PermissionsLayout {
        gap: 24px;
        padding: 8px;
        display: flex;
    }

</style>
