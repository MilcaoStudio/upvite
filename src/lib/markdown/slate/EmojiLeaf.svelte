<script lang="ts">
    import { RE_EMOJI } from "../plugins/remarkRegex";
    interface Props {
        leaf: any;
        children?: import('svelte').Snippet;
    }

    let { leaf, children }: Props = $props();
    let match = RE_EMOJI.exec(leaf.text);
    let group: string | undefined,
        id = "",
        fail = false;
        /*
    while (match) {
        group = match[1];
        id = match[2];
        match = RE_EMOJI.exec(leaf.text);
    }
    $: url = RE_ULID.test(id)
        ? // Matches ULID
          match == "RV"
            ? `https://autumn.revolt.chat/emojis/${id}`
            : `${clientController.anonymousClient.configuration?.features.autumn.url}/emojis/${match}`
        : // Not matches ULID
          match == "DC"
          ? `https://cdn.discordapp.com/emojis/${id}?quality=lossless`
          : unicodeEmojiURL(RevoltEmojiDictionary[id] || id);*/
</script>

<span style:background="var(--block)" data-slate-leaf="true">
    {@render children?.()}
</span>

<style>
    .emoji {
        object-fit: contain;

        height: var(--emoji-size);
        width: var(--emoji-size);
        margin: 0 0.05em 0 0.1em;
        vertical-align: -0.3em;
    }

    .emoji:before {
        content: " ";
        display: block;
        position: absolute;
        height: 50px;
        width: 50px;
        background-image: url(ishere.jpg);
    }
</style>
