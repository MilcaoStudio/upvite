<script context="module" lang="ts">
    export const ItemContainer = cx(
        "ItemContainer",
        css`
            width: 56px;
            padding-left: 7px;
            padding-right: 7px;
            padding-bottom: 6px;
            cursor: pointer;
        `,
    );
</script>

<script lang="ts">
    import type { INotificationChecker } from "revolt.js/dist/util/Unreads";
    import { InfoBadge, PersonPicture } from "fluent-svelte";
    import { css, cx } from "@emotion/css";
    import type { Server } from "revolt.js";
    import Tooltip from "$lib/components/atoms/Tooltip.svelte";
    export let head = false,
        item: Server,
        permit: INotificationChecker; //, active = false;
    const ItemContainer = cx(
        "ItemContainer",
        css`
            width: 56px;
            padding-left: 7px;
            padding-right: 7px;
            padding-bottom: 6px;
            cursor: pointer;
            ${head ? `padding-top: 6px;` : ``}
        `,
    );
    //const unread = !!item.isUnread(permit);
    const count = item.getMentions(permit).length;
</script>

<div class={ItemContainer}>
    <!--TODO: Show Swoosh component if active-->
    <Tooltip content={item.name} div right>
        <!--TODO: Trigger component for right click-->
        <a href={`/server/${item._id}`}>
            <!--TODO: Custom component that includes unread slot-->
            <PersonPicture
                size={42}
                alt={item.name}
                src={item.generateIconURL({ max_side: 256 }, false)}
            >
            <InfoBadge severity="critical" slot="badge">{count}</InfoBadge>
            </PersonPicture>
        </a>
    </Tooltip>
</div>
