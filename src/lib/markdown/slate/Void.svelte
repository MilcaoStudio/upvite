<script lang="ts">

    interface Props {
        isInline: boolean;
        ref: HTMLElement;
        dir?: "rtl" | "ltr" | undefined;
        children?: import('svelte').Snippet;
    }

    let {
        isInline,
        ref = $bindable(),
        dir = undefined,
        children
    }: Props = $props();
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
    {@render children?.()}
</svelte:element>
