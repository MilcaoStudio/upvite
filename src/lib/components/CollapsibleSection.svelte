<script lang="ts">
    import Details from "$lib/Details.svelte";
    import BxChevronDown from "svelte-boxicons/BxChevronDown.svelte";
    import type { Snippet } from "svelte";
    import { useState } from "./state/StateContext.svelte";

    interface Props {
        id: string;
        defaultValue: boolean;
        summary?: Snippet;
        children?: Snippet;
        [key: string]: any
    }

    let {
        id,
        defaultValue,
        summary,
        children,
        ...rest
    }: Props = $props();
    const layout = useState().layout;
</script>

<Details open={layout.isSectionOpen(id) ?? defaultValue} ontoggle={(e) =>
    layout.setSectionState(id, e.currentTarget.open, defaultValue)
} {...rest}>
    {#snippet summary()}
        <BxChevronDown size={20} />
        {@render summary?.()}
    {/snippet}
    {@render children?.()}
</Details>