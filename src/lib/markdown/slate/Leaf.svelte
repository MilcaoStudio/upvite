<script lang="ts">
    import type { IText } from "svelte-slate/plugins";
    import type { RichText } from "./types";
    import UserMention from "../plugins/UserMention.svelte";
    export let leaf: IText & RichText;
    $: console.debug(leaf.text);
</script>

<span data-slate-leaf="true" style:font-weigth={leaf.bold ? "bold": "normal"} style:font-style={leaf.italic ? "italic": "normal"} style:text-decoration={leaf.underline ? "underline" : leaf.strikeThrough ? "line-through" : "none"}>
    <slot/>
</span>