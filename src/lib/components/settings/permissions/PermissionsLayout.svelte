<script lang="ts">
    import type { Channel } from "revolt.js";
    import EditorForChannel from "./RoleEditorForChannel.svelte";
    import RoleList from "../permissions/RoleList.svelte";
    import { modalController } from "$lib/components/modals/ModalController";
    import RoleEditorForServer from "../server/RoleEditorForServer.svelte";

    export let channel: Channel | undefined = undefined,
        server = channel?.server;
    let selected = "default";
</script>

{#if server}
    <div class="PermissionsLayout">
        {#if channel}
        <RoleList
            {server}
            rank={server.member?.ranking ?? Infinity}
            {selected}
            onSelect={(v) => (selected = v)}
            showDefault
        />
            <EditorForChannel {selected} {channel} />
        {:else}
            <RoleList
                {server}
                {selected}
                rank={0}
                onSelect={(v) => (selected = v)}
                onCreateRole={(onSelect) =>
                    modalController.push({
                        type: "create_role",
                        server,
                        callback: onSelect,
                    })}
                showDefault
            />
            <RoleEditorForServer {selected} {server} />
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
