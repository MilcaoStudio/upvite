<style>
    div.Sidebar {
        height: 100%;
        display: flex;
        user-select: none;
        flex-direction: row;
        align-items: stretch;
        /*background: var(--background);*/

        background-color: rgba(
            var(--background-rgb)
        );
        backdrop-filter: blur(20px);
    }
</style>

<div class="Sidebar">
    <slot />
</div>