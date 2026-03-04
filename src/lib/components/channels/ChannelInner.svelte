<script lang="ts">
    import { InfoBadge, PersonPicture } from "fluent-svelte";
    import type { Channel } from "stoat.js";
    import Tooltip from "../atoms/Tooltip.svelte";
    interface Props {
        channel: Channel;
    }

    let { channel }: Props = $props();
    let unread = $derived(channel.unread);
    let count = $derived(channel.mentions?.size);
</script>

<Tooltip content={channel.name ?? channel.recipient?.username} div right>
    <!--REMINDER: Make this component interactable-->
    {#if count}
        <PersonPicture
            size={42}
            alt={channel.name ?? ""}
            src={channel.animatedIconURL}
        >
            <InfoBadge severity="critical">{count}</InfoBadge>
        </PersonPicture>
    {:else}
        <PersonPicture
            size={42}
            alt={channel.name ?? ""}
            src={channel.animatedIconURL}
        />
    {/if}
</Tooltip>
