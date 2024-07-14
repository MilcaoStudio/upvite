<script lang="ts">
	import type { IElement } from "svelte-slate/plugins";
	import UserMention from "../plugins/UserMention.svelte";
	import Void from "./Void.svelte";

	export let element: IElement;
	export let isInline: boolean;
	export let isVoid: boolean;
	export let contenteditable: boolean;
	export let dir: "rtl" | "ltr" | undefined = undefined;
	export let ref: HTMLElement;
	switch (element.type) {
		case "mention": case "channel": case "emoji": case "timestamp":
			isInline = true
	}
</script>

{#if isVoid}
	<Void {element} bind:ref {isInline} {dir}>
		<slot />
	</Void>
{:else}
	<svelte:element
		this={isInline ? "span": "div"}
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
