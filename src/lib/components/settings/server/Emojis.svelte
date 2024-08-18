<script lang="ts">
    import Column from "$lib/components/atoms/layout/Column.svelte";
import { autorun } from "mobx";
    import type { Server } from "revolt.js";
    import EmojiUploader from "./EmojiUploader.svelte";
    import { t } from "svelte-i18n";
    import EmojiEditor from "./EmojiEditor.svelte";

    export let server: Server;
    let emojis = [...server.client.emojis.values()].filter(
        (x) => x.parent.type == "Server" && x.parent.id == server._id,
    );
    $: autorun(() => {
        emojis = [...server.client.emojis.values()].filter(
            (x) => x.parent.type == "Server" && x.parent.id == server._id,
        );
    });
</script>

<Column>
    {#if server.havePermission("ManageCustomisation")}
        <EmojiUploader {server} />
    {/if}
    <h3>
        {$t("app.settings.server_pages.emojis.title")} - {emojis.length}
    </h3>
    {#each emojis as emoji (emoji._id)}
        <EmojiEditor {emoji} {server} />
    {/each}
</Column>