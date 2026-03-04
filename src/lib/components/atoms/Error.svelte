<script lang="ts">
    interface Props {
        error?: string;
        children?: import('svelte').Snippet;
    }

    let { error = '', children }: Props = $props();
</script>

<span class="Base">
    {@render children?.()}
    <span class="error">
        {#if error}
            &middot;
        {/if}
        {error}
    </span>
</span>
