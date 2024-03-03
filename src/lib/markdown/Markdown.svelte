<script lang="ts">
    import RemarkRenderer from "./RemarkRenderer.svelte";

    export let content: string | null;
</script>

{#if content}
    <RemarkRenderer {content} />
{/if}