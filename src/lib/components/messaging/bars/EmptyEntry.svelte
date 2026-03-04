<script lang="ts">
    

    interface Props {
        class?: string;
        onClick?: (()=>void) | null;
        children?: import('svelte').Snippet;
    }

    let { class: className = "", onClick = null, children }: Props = $props();
</script>

<button class="EmptyEntry {className}" onclick={onClick}>
    {@render children?.()}
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