<script lang="ts">
    export let error: string = ''
</script>

<span class="Base">
    <slot />
    <span class="error">
        {#if error}
            &middot;
        {/if}
        {error}
    </span>
</span>

<style>
    span.Base {
        gap: 6px;
        display: flex;
        align-items: center;
        flex-direction: row;
        color: var(--foreground);
    }

    span.Base .error {
        font-weight: 600;
        color: var(--error);
    }
</style>