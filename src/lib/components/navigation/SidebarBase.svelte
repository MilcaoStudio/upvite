<style>
    div.SidebarBase {
        height: 100%;
        display: flex;
        user-select: none;
        flex-direction: row;
        align-items: stretch;
        /*background: var(--background);*/

        background-color: rgba(
            var(--background-rgb),
            max(var(--min-opacity), 0.75)
        );
        backdrop-filter: blur(20px);
    }
</style>

<div class="SidebarBase">
    <slot />
</div>