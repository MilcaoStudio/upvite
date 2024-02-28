<script lang="ts">
    import type { User } from "revolt.js";
    import Tooltip from "../atoms/Tooltip.svelte";
    import { css, cx } from "@emotion/css";

    export let user: User | null;
    const Base = cx(
        "UserTooltip",
        css`
            display: flex;
            flex-direction: column;

            .username {
                font-size: 13px;
                font-weight: 600;
            }

            .status {
                font-size: 11px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        `,
    );
</script>

<Tooltip
    content={`${user?.username}\n${user?.status?.presence || ''}`}
    {...$$restProps}
>
    <slot />
</Tooltip>
