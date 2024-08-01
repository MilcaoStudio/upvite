<script lang="ts">

    export let isInline: boolean,
        ref: HTMLElement,
        dir: "rtl" | "ltr" | undefined = undefined;
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
    <!-- TODO: Render void elements -->
    <slot />
</svelte:element>
