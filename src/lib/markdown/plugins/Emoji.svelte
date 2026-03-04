<script lang="ts">
    import { RE_ULID } from "$lib";
    import { clientController, useClient } from "$lib/controllers/ClientController";
    import { css, cx } from "@emotion/css";

    export let match: string | null = null, arg1: string;
    const client = useClient();
    const Icon = cx("emoji", match, css`
        object-fit: contain;

        height: var(--emoji-size);
        width: var(--emoji-size);
        margin: 0 0.05em 0 0.1em;
        vertical-align: -0.3em;

        img:before {
            content: " ";
            display: block;
            position: absolute;
            height: 50px;
            width: 50px;
            background-image: url(ishere.jpg);
        }
    `);
    let fail = false;
    
    $: url = //RE_ULID.test(arg1) ?
        // Matches ULID
        match == "RV" ? `https://autumn.revolt.chat/emojis/${arg1}` :
        `${client.configuration?.features.autumn.url}/emojis/${arg1}` 
        /*
        :
        // Not matches ULID
        match == "DC" ? `https://cdn.discordapp.com/emojis/${arg1}?quality=lossless`
        : unicodeEmojiURL(RevoltEmojiDictionary[arg1] || arg1);*/
    
</script>

{#if fail}
    <span>{#if match}:{match}{/if}:{arg1}:</span>
{:else}
    <img class={Icon} alt=":{arg1}:" loading="lazy" draggable="false" src={url} on:error={()=>(fail=true)} />
{/if}
