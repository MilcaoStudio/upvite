<script lang="ts">
    import { BxChevronDown } from "svelte-boxicons";
    import Tree, { type Node } from "./Tree.svelte";
    import Details from "$lib/Details.svelte";
    import { state } from "$lib/State";

    export let id: string,
        defaultValue: boolean,
        summary: Node;
    const layout = state.layout;
</script>

<Details open={layout.getSectionState(id, defaultValue)} onToggle={(e) =>
    layout.setSectionState(id, e.currentTarget.open, defaultValue)
} {...$$restProps}>
    <summary>
        <div class="padding">
            <BxChevronDown size={20} />
            <Tree node={summary} />
        </div>
    </summary>
    <slot />
</Details>
