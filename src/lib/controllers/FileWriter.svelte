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
    <button class="export flex-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-download">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
            <path d="M7 11l5 5l5 -5" />
            <path d="M12 4l0 12" />
          </svg>
          <span>Export   </span>
    </button>
</ConditionalLink>

<style>
    .export {
        max-width: 200px;
        padding: 6px 12px;

    }
</style>
