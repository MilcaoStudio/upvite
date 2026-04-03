<script module>
  import type SessionController from "./Controller.svelte";
  import { createContext, type Snippet } from "svelte";
  import type { Client } from "stoat.js";
  const [getClientControllerContext, setClientControllerContext] = createContext<ClientController>();

  export function useClientController() {
    return getClientControllerContext();
  }
  /**
  * Get the currently active session.
  */
  export function useSession(): SessionController | undefined {
    return useClientController().activeSession;
  }

  /**
  * Get the currently active client or an unauthorised client.
  */
  export function useClient(): Client {
    return useClientController().availableClient;
  }

  /**
  * Get unauthorised client for API requests.
  */
  export function useApi() {
    return useClientController().anonymousClient.api;
  }
</script>

<script lang="ts">
    import { ClientController } from "./Controller.svelte";
    import { useState } from "../state/StateContext.svelte";

  interface Props {
    children?: Snippet,
  }
  let { children }: Props= $props();
  let auth = useState().auth;
  let clientController = new ClientController(auth);
  
  setClientControllerContext(clientController);
</script>

{@render children?.()}