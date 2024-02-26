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
