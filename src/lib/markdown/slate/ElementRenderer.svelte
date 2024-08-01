<script lang="ts">
	//import type { IElement } from "svelte-slate/plugins";
	import Void from "./Void.svelte";

	//export let element: IElement;
	export let isInline: boolean,
		isVoid: boolean,
		contenteditable: boolean,
		dir: "rtl" | "ltr" | undefined = undefined,
		ref: HTMLElement;
</script>

{#if isVoid}
	<Void bind:ref {isInline} {dir}>
		<slot />
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
		<slot />
	</svelte:element>
{/if}

<style>
	div,
	span {
		line-height: var(--textarea-line-height);
	}
</style>
