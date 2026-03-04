<script lang="ts">
    import Tooltip from './Tooltip.svelte';
    import { _ } from "svelte-i18n";
    import tippy, { type TippyProps } from "svelte-tippy";

    interface Props {
        div?: boolean;
        right?: boolean;
        i18n?: string;
        content?: string | undefined;
        placement?: TippyProps["placement"] |undefined;
        children?: import('svelte').Snippet;
    }

    let {
        div = false,
        right = false,
        i18n = '',
        content = undefined,
        placement = undefined,
        children
    }: Props = $props();
</script>

{#if div}
    <Tooltip {right} {i18n} {content} {placement}>
        <div >{@render children?.()}</div>
    </Tooltip>
{:else if i18n}
    <Tooltip content={$_(i18n)} {right} {placement}/>
{:else}
    <div 
        use:tippy={{
            animation: "shift-away-extreme",
            placement: right ? "right" : placement,
            content,
        }}
    >{@render children?.()}</div>
{/if}
