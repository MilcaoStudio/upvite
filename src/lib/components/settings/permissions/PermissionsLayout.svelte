<script lang="ts">
    import type { Channel } from "revolt.js";
    import EditorForChannel from "./RoleEditorForChannel.svelte";
    import RoleList from "../permissions/RoleList.svelte";

    export let channel: Channel | undefined = undefined,
        server = channel?.server;
    let selected = "default";
</script>

{#if server}
    <div class="PermissionsLayout">
        <!-- TODO: Editor for server roles -->
       <RoleList {server} rank={0} {selected} onSelect={(v)=>selected = v} showDefault />
        {#if channel}
            <EditorForChannel {selected} {channel} />
        {/if} 
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

    .PermissionsLayout > :global(:nth-child(1)) {
        max-width: 250px;
        flex-shrink: 0;
    }
</style>
