<script lang="ts">
    import { css, cx } from "@emotion/css";
    import type { Channel, User } from "revolt.js";

    export let active = false,
        alert: "unread" | "mention" | undefined = undefined,
        alertCount = 0,
        channel: Channel | undefined,
        user: User | undefined = undefined,
        compact = false,
        muted = false;
    const alerting = alert && !muted && !active;
</script>

{#if channel}
{#if channel.channel_type != 'DirectMessage'}
    <div data-active={active}
    data-alert={alerting}
    data-muted={muted}
    aria-label={channel.name} class={cx('item', { ['compact']: compact })}
    {...$$props}>
        <div class="avatar">
            #
        </div>
        <div class="name">
            <div>{channel.name}</div>
        </div>
        <div class="button">
            {#if alerting}
                <div class="alert" data-style={alert}>
                    {alertCount}
                </div>
            {/if}
            <!--TODO: Add leave group action for touchscreens-->
        </div>
    </div>
{/if}
{/if}