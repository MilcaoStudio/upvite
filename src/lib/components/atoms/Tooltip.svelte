<script lang="ts">
    import { _ } from "svelte-i18n";
    import tippy from "svelte-tippy";

    export let div = false,
        right = false,
        i18n: string = '',
        content: string | undefined = undefined;
    console.log('[Tooltip] Tooltip rendered!');
</script>

{#if div}
    <svelte:self {right} {i18n} {content}>
        <div><slot /></div>
    </svelte:self>
{:else if i18n}
    <svelte:self content={$_(i18n)} {right}></svelte:self>
{:else}
    <div
        use:tippy={{
            animation: "shift-away",
            placement: right ? "right" : undefined,
            content,
        }}
    />
{/if}
