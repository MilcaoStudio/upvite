<script lang="ts">
    import CategoryButton from "$lib/components/form/CategoryButton.svelte";
    import Details from "$lib/Details.svelte";
    import type { Snippet } from "svelte";

    interface Props {
        title: string;
        children?: Snippet;
    }
    let { title, children }: Props = $props();
    let isOpen = $state(false);
    let column: HTMLDivElement | undefined = $state();

    function toggle() {
        if (!isOpen) {
            column?.scroll({ top: 0 });
        }
        isOpen = !isOpen;
    }

    let updatedHeight = $derived.by(() => {
        const calculatedHeight = isOpen
            ? Math.min(column?.scrollHeight || 0, 340)
            : 0;

        return `${calculatedHeight}px`;
    });
</script>

<Details onclick={toggle} class={isOpen ? "open" : undefined}>
    <summary>
        <CategoryButton>{title}</CategoryButton>
    </summary>
    <!-- TODO: make collapse scrollable -->
    <div class="column" bind:this={column} style:height={updatedHeight}>
        {@render children?.()}
    </div>
</Details>
