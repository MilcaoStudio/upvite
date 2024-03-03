// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare type DndEvent<ItemType = import('svelte-dnd-action').Item> = import('svelte-dnd-action').DndEvent<ItemType>;
declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onconsider?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T})=>void
		onfinalize?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T})=>void
	}
}

declare module 'mdast' {
	interface RootContentMap {
	  timestamp: {
		type: "timestamp",
	  }
	}
}

declare module 'unified' {
	interface CompileResultMap {
	  // Register a new result (value is used, key should match it).
	  SvelteElement: import("$lib/markdown/runtime/svelteRuntime").SvelteElement
	}
  }
export {};
