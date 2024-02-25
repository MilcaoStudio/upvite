<script lang="ts">
    import { css, cx } from "@emotion/css";
    import Tooltip from "./Tooltip.svelte";
    import { t } from "svelte-i18n";
    import type { TippyProps } from "svelte-tippy";

    export let permission: string, placement: TippyProps["placement"] | undefined = undefined;
    const Base = cx('PermissionTooltip', css`
        display: flex;
        align-items: center;
        flex-direction: column;

        span {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--secondary-foreground);
        }

        code {
            font-family: var(--monospace-font);
        }`);
</script>

<Tooltip content="" {placement}>
    <div class={Base}>
        <slot />
        <span>{$t('app.permissions.required')}</span>
        <code>{permission}</code>
    </div>
</Tooltip>