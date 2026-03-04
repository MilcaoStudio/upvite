<script lang="ts">
    import RemarkRenderer from "./RemarkRenderer.svelte";

    interface Props {
        content: string | null;
    }

    let { content }: Props = $props();
</script>

{#if content}
    <RemarkRenderer {content} />
{/if}