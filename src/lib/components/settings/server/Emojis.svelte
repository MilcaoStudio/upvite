<script lang="ts">
    import "./Emojis.css";
    import Column from "$lib/components/atoms/layout/Column.svelte";
    import { autorun } from "mobx";
    import type { Server } from "revolt.js";
    import EmojiUploader from "./EmojiUploader.svelte";
    import { t } from "svelte-i18n";
    import EmojiEditor from "./EmojiEditor.svelte";
    import Row from "$lib/components/atoms/layout/Row.svelte";
    import H3 from "$lib/components/atoms/heading/H3.svelte";
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
        <EmojiUploader />
    {/if}
    <h3>
        {$t("app.settings.server_pages.emojis.title")} - {emojis.length}
    </h3>
    <div class="EmojiTable">
        <Row centred>
            <H3 class="icon">icon</H3>
            <H3 class="label">name</H3>
            <H3 class="label">uploaded by</H3>
        </Row>
        {#each emojis as emoji (emoji._id)}
            <EmojiEditor {emoji} {server} />
        {/each}
    </div>
</Column>
