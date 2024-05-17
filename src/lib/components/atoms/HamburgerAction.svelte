<script lang="ts">
    import { state } from "$lib/State";
    import { Viewport } from "$lib/stores/Layout";
    import Menu from "svelte-boxicons/BxMenu.svelte";

    let isVertical = state.layout.getViewport() == Viewport.SMALL;
    function openSidebar() {
        document
            .querySelector(".snap")
            ?.scrollTo({ behavior: "smooth", left: 0 });
    }
</script>

{#if isVertical}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="menu" on:click={openSidebar} on:keydown={openSidebar}>
        <Menu size={27} />
    </div>
{/if}
