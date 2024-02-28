<script context="module" lang="ts">
    export const remarkMention = createComponent("mention", RE_MENTIONS, (match) =>
    clientController.availableClient.users.has(match),
);
</script>

<script lang="ts">
    import UserShort from "$lib/components/user/UserShort.svelte"
    import { clientController } from "$lib/controllers/ClientController";
    import { RE_MENTIONS } from "revolt.js";
    import { createComponent } from "./remarkRegex";
    export let match: string;
</script>

<UserShort
    showServerIdentity
    user={clientController.availableClient.users.get(match)}
/>