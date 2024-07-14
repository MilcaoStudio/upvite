<script lang="ts">
    import type { IElement } from "svelte-slate/plugins";
    import UserMention from "../plugins/UserMention.svelte";

    export let isInline: boolean,
        ref: HTMLElement,
        dir: "rtl" | "ltr" | undefined = undefined,
        element: IElement;
</script>

<svelte:element
    this={isInline ? "span" : "div"}
    bind:this={ref}
    data-slate-node="element"
    data-slate-inline={isInline}
    data-slate-void="true"
    {dir}
    contenteditable="false"
>
    <slot />
    {#if element.type == "mention"}
        <UserMention match={element.match} />
    {/if}
</svelte:element>
