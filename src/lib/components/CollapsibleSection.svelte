<script lang="ts">
    import JSXRender from "./JSXRender.svelte";
    import Details from "$lib/Details.svelte";
    import { state } from "$lib/State";
    import type { SvelteNode } from "$lib/markdown/runtime/svelteRuntime";
    import BxChevronDown from "svelte-boxicons/BxChevronDown.svelte";

    interface Props {
        id: string;
        defaultValue: boolean;
        summary: SvelteNode;
        children?: import('svelte').Snippet;
        [key: string]: any
    }

    let {
        id,
        defaultValue,
        summary,
        children,
        ...rest
    }: Props = $props();
    const layout = state.layout;
</script>

<Details open={layout.getSectionState(id, defaultValue)} onToggle={(e) =>
    layout.setSectionState(id, e.currentTarget.open, defaultValue)
} {...rest}>
    <summary>
        <div class="padding">
            <BxChevronDown size={20} />
            <JSXRender node={summary} />
        </div>
    </summary>
    {@render children?.()}
</Details>
