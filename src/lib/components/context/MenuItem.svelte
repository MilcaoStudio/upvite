<script lang="ts">
    import { getContext } from "svelte";

    export let data: unknown, disabled = false;
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

<button on:click={(ev)=>{onClick(ev, callback, data)}}>
    <slot />
</button>