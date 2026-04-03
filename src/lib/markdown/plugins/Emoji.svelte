<script lang="ts">
    import { RE_ULID } from "$lib";
    import { useClient } from "$lib/components/client/ClientContext.svelte";
    import { css, cx } from "@emotion/css";

    interface Props {
        match?: string | null;
        arg1: string;
    }

    let { match = null, arg1 }: Props = $props();
    const client = useClient();
    const Icon = $derived(cx("emoji", match, css`
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
    `));
    let fail = $state(false);
    
    let url = //RE_ULID.test(arg1) ?
        // Matches ULID
        $derived(match == "RV" ? `https://autumn.revolt.chat/emojis/${arg1}` :
        `${client.configuration?.features.autumn.url}/emojis/${arg1}`) 
        /*
        :
        // Not matches ULID
        match == "DC" ? `https://cdn.discordapp.com/emojis/${arg1}?quality=lossless`
        : unicodeEmojiURL(RevoltEmojiDictionary[arg1] || arg1);*/
    
</script>

{#if fail}
    <span>{#if match}:{match}{/if}:{arg1}:</span>
{:else}
    <img class={Icon} alt=":{arg1}:" loading="lazy" draggable="false" src={url} onerror={()=>(fail=true)} />
{/if}
