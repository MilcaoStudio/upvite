<script lang="ts">
    import { getContext } from "svelte";

    interface Props {
        data: unknown;
        disabled?: boolean;
        children?: import('svelte').Snippet;
    }

    let { data, disabled = false, children }: Props = $props();
    let callback = getContext<(data: unknown)=>void>("Menu");
    let onClick = function<T>(ev: Event, fn: ((data: T)=>void) | undefined, data: T) {
        if (disabled) {
            return;
        }
        ev.stopPropagation();
        if (!fn) {
            throw ReferenceError("fn is not callable");
        }
        fn(data);
    }
</script>

<button onclick={(ev)=>{onClick(ev, callback, data)}}>
    {@render children?.()}
</button>