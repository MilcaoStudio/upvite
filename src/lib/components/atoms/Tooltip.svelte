<script lang="ts">
    import { _ } from "svelte-i18n";
    import tippy, { type TippyProps } from "svelte-tippy";

    export let div = false,
        right = false,
        i18n: string = '',
        content: string | undefined = undefined,
        placement: TippyProps["placement"] |undefined = undefined;
    console.log('[Tooltip] Tooltip rendered!');
</script>

{#if div}
    <svelte:self {right} {i18n} {content} {placement}>
        <div ><slot /></div>
    </svelte:self>
{:else if i18n}
    <svelte:self content={$_(i18n)} {right} {placement}/>
{:else}
    <div 
        use:tippy={{
            animation: "shift-away",
            placement: right ? "right" : placement,
            content,
        }}
    ><slot /></div>
{/if}
