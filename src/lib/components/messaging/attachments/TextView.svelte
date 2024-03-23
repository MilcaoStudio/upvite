<script lang="ts">
    import Button from "$lib/components/atoms/Button.svelte";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import { useClient } from "$lib/controllers/ClientController";
    import axios from "axios";
    import type { API } from "revolt.js";
    import { t } from "svelte-i18n";

    const fileCache: { [key: string]: string } = {};
    const client = useClient();
    export let attachment: API.File;
    $: url = client.generateFileURL(attachment)!;
    let gated = attachment.size > 100_000;
    let content = "";
    let loading = false;
    $: {
        if (!content || !loading || !gated) {
            loading = true;
            const cached = fileCache[attachment._id];
            if (cached) {
                content = cached;
                loading = false;
            } else {
                axios
                    .get(url, { transformResponse: [] })
                    .then((res) => {
                        content = res.data;
                        fileCache[attachment._id] = res.data;
                        loading = false;
                    })
                    .catch(() => {
                        console.error(
                            "Failed to load text file. [",
                            attachment._id,
                            "]",
                        );
                        loading = false;
                    });
            }
        }
    }
</script>

<div class="textContent" data-loading={!content.length}>
    {#if gated}
        <Button palette="primary" onClick={() => (gated = false)}>
            {$t("app.main.channel.misc.load_file")}
        </Button>
    {:else if content}
        <pre>
            <code>{content}</code>
        </pre>
    {:else}
        <!--Requires online-->
        <Preloader type="ring" />
    {/if}
</div>

<style>
    .textContent {
        height: 140px;
        padding: 12px;
        overflow-x: auto;
        overflow-y: auto;
        border-radius: 0;
        background: var(--secondary-header);
    }
</style>
