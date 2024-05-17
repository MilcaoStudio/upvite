<script lang="ts">
    let className = "";
    export {className as class};

    export let onClick: (()=>void) | null = null; 
</script>

<button class="EmptyEntry {className}" on:click={onClick}>
    <slot />
</button>

<style>
    .EmptyEntry {
        width: 100px;
        height: 100px;
        display: grid;
        flex-shrink: 0;
        cursor: pointer;
        place-items: center;
        border-radius: var(--border-radius);
        background: var(--primary-background);
        transition: 0.1s ease background-color;
    }

    .EmptyEntry:hover {
        background: var(--secondary-background);
    }
</style>