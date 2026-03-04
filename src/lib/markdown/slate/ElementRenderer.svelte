<script lang="ts">
	//import type { IElement } from "svelte-slate/plugins";
	import Void from "./Void.svelte";

	//export let element: IElement;
	interface Props {
		isInline: boolean;
		isVoid: boolean;
		contenteditable: boolean;
		dir?: "rtl" | "ltr" | undefined;
		ref: HTMLElement;
		children?: import('svelte').Snippet;
	}

	let {
		isInline,
		isVoid,
		contenteditable,
		dir = undefined,
		ref = $bindable(),
		children
	}: Props = $props();
</script>

{#if isVoid}
	<Void bind:ref {isInline} {dir}>
		{@render children?.()}
	</Void>
{:else}
	<svelte:element
		this={isInline ? "span" : "div"}
		bind:this={ref}
		data-slate-node="element"
		data-slate-inline={isInline}
		data-slate-void={isVoid}
		{dir}
		{contenteditable}
	>
		{@render children?.()}
	</svelte:element>
{/if}

<style>
	div,
	span {
		line-height: var(--textarea-line-height);
	}
</style>
