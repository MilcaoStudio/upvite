<script lang="ts">
    import { RE_ULID } from "$lib";
    import { clientController } from "$lib/controllers/ClientController";
    import { css, cx } from "@emotion/css";
    import { RevoltEmojiDictionary, unicodeEmojiURL } from "revkit";

    export let match: string;
    const Icon = cx("emoji", match, css`
        object-fit: contain;

        height: var(--emoji-size);
        width: var(--emoji-size);
        margin: 0 0.05em 0 0.1em;
        vertical-align: -0.2em;

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
    $: url = RE_ULID.test(match)
        ? `${clientController.anonymousClient.configuration?.features.autumn.url}/emojis/${match}`
        : unicodeEmojiURL(RevoltEmojiDictionary[match] || match);
    
</script>

{#if fail}
    <span>:{match}:</span>
{:else}
    <img class={Icon} alt=":{match}:" loading="lazy" draggable="false" src={url} on:error={()=>(fail=true)} />
{/if}
