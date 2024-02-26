<script lang="ts">
    import { isTouchscreenDevice } from "$lib";
    import { BxMenu } from 'svelte-boxicons'
    function openSidebar() {
        document
            .querySelector("#app > div > div > div")
            ?.scrollTo({ behavior: "smooth", left: 0 });
    }
</script>

{#if isTouchscreenDevice}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="menu" on:click={openSidebar} on:keydown={openSidebar}>
        <BxMenu size="27" />
    </div>
{/if}
