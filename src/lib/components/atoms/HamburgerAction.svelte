<script lang="ts">
    import { Viewport } from "$lib/components/state/stores/Layout";
    import Menu from "svelte-boxicons/BxMenu.svelte";
    import { useState } from "../state/StateContext.svelte";

    let isVertical = useState().layout.getViewport() == Viewport.SMALL;
    function openSidebar() {
        document
            .querySelector(".snap")
            ?.scrollTo({ behavior: "smooth", left: 0 });
    }
</script>

{#if isVertical}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="menu" onclick={openSidebar} onkeydown={openSidebar}>
        <Menu size={27} />
    </div>
{/if}
