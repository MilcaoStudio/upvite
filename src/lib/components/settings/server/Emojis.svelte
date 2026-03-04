<script lang="ts">
    import { run } from 'svelte/legacy';

    import "./Emojis.css";
    import Column from "$lib/components/atoms/layout/Column.svelte";
    import { autorun } from "mobx";
    import type { Server } from "stoat.js";
    import EmojiUploader from "./EmojiUploader.svelte";
    import { t } from "svelte-i18n";
    import EmojiEditor from "./EmojiEditor.svelte";
    import Row from "$lib/components/atoms/layout/Row.svelte";
    import H3 from "$lib/components/atoms/heading/H3.svelte";
    interface Props {
        server: Server;
    }

    let { server }: Props = $props();

    let emojis = $state(server.emojis);
    run(() => {
        autorun(() => {
            emojis = server.emojis;
            console.debug("[Emojis.svelte] Emoji list for %s updated", server.id);
        });
    });
</script>

<Column>
    {#if server.havePermission("ManageCustomisation")}
        <EmojiUploader {server} />
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
        {#each emojis as emoji (emoji.id)}
            <EmojiEditor {emoji} {server} />
        {/each}
    </div>
</Column>
