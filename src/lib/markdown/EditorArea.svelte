<script lang="ts">
	export let isInline: boolean;
	export let isVoid: boolean;
	export let contenteditable: boolean;
	export let dir: 'rtl' | 'ltr' | undefined = undefined;
</script>

{#if isInline}
<span
		data-slate-node="element"
		data-slate-inline={isInline}
		data-slate-void={isVoid}
		{dir}
		{contenteditable}><slot /></span
	>
{:else}
<div
		data-slate-node="element"
		data-slate-void={isVoid}
		{dir}
		{contenteditable}
	>
		<slot />
</div>
{/if}

<style>
    div {
        flex-grow: 1;
        display: flex;
        border-radius: 3px;
        min-height: 60px;
        padding: var(--message-box-padding);
        border: 1px solid var(--secondary-foreground);
    }
</style>