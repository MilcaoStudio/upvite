<script lang="ts">
    import { isTouchscreenDevice } from "$lib";
    function openSidebar() {
        document
            .querySelector("#app > div > div > div")
            ?.scrollTo({ behavior: "smooth", left: 0 });
    }
</script>

{#if isTouchscreenDevice}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="menu" on:click={openSidebar} on:keydown={openSidebar}>
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-home">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
            <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
          </svg>
    </div>
{/if}
