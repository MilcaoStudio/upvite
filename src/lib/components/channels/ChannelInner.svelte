<script lang="ts">
    import { InfoBadge, PersonPicture } from "fluent-svelte";
    import type { Channel } from "revolt.js";
    import type { INotificationChecker } from "revolt.js/dist/util/Unreads";
    import Tooltip from "../atoms/Tooltip.svelte";
    export let channel: Channel, permit: INotificationChecker;
    $: unread = channel.isUnread(permit);
    $: count = channel.getMentions(permit).length;
</script>

<Tooltip content={channel.name ?? channel.recipient?.username} div right>
    <!--REMINDER: Make this component interactable-->
    {#if count}
        <PersonPicture
            size={42}
            alt={channel.name ?? ""}
            src={channel.generateIconURL({ max_side: 256 }, false)}
        >
            <InfoBadge severity="critical">{count}</InfoBadge>
        </PersonPicture>
    {:else}
        <PersonPicture
            size={42}
            alt={channel.name ?? ""}
            src={channel.generateIconURL({ max_side: 256 }, false)}
        />
    {/if}
</Tooltip>
