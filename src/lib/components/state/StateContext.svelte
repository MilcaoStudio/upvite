<script module>
  import { createContext } from "svelte";
  const [getAppState, setAppState] = createContext<State>();

  export function useState() {
    return getAppState();
  }
</script>

<script lang="ts">
  import State from "./State";
  import {type Snippet } from "svelte";

  interface Props {
    children?: Snippet,
  }

  let {children}: Props = $props();
  
  setAppState(new State());
</script>

{@render children?.()}