<script lang="ts">
    import ConditionalLink from "$lib/components/atoms/ConditionalLink.svelte";
    import Download from "svelte-boxicons/BxDownload.svelte";
    export let data = "",
        fileType = "text/plain",
        encoding = "utf8",
        filename = "unknown.txt",
        disabled = false;
</script>

<ConditionalLink
    active={disabled}
    href="data:{fileType}; charset={encoding}, {encodeURIComponent(data)}"
    download={filename}
>
    <button class="export"><Download size={18} />Export</button>
</ConditionalLink>

<style>
    .export {
        max-width: 200px;
        border-radius: 8px;
        padding: 6px 12px;
        background-color: red;
    }
</style>
