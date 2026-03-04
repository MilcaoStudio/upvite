<script>
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<style>
    div.SidebarList {
        padding: 6px;
        flex-grow: 1;
        overflow-y: scroll;
    }
    div.SidebarList > :global(img) {
        width: 100%;
    }
</style>

<div class="SidebarList">
    {@render children?.()}
</div>