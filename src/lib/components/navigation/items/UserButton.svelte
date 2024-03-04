<script lang="ts">
    import { cx } from "@emotion/css";
    import type { Channel, User } from "revolt.js";
    import UserIcon from "../../user/UserIcon.svelte";
    import Username from "../../user/Username.svelte";
    import Tooltip from "../../atoms/Tooltip.svelte";
    import { t } from "svelte-i18n";
    import { BxCrown, BxX } from "svelte-boxicons";
    import { isTouchscreenDevice } from "$lib";
    import { IconButton } from "fluent-svelte";
    import { modalController } from "../../modals/ModalController";
    import "./Item.css"

    export let active = false,
        alert: "unread" | "mention" | null = null,
        alertCount = 0,
        margin = false,
        muted = false,
        user: User,
        context: Channel | undefined = undefined,
        channel: Channel | undefined = undefined;
</script>

<div
    {...$$restProps}
    class={cx("item", "user")}
    data-active={active}
    data-margin={margin}
    data-muted={muted}
    data-alert={typeof alert == "string"}
    data-online={typeof channel != undefined ||
        (user.online && user.status?.presence != "Invisible")}
>
    <UserIcon
        class="avatar"
        target={user}
        size={32}
        status
        showServerIdentity
    />
    <div class="name">
        <div>
            <Username {user} showServerIdentity />
        </div>
        <div class="subText">
            {#if typeof channel?.last_message?.content == "string" && alert}
                {channel.last_message.content.slice(0, 32)}
            {:else}
                <!--<UserStatus user={user} tooltip />-->
            {/if}
        </div>
    </div>
    <div class="button">
        {#if context?.channel_type == "Group" && context.owner_id == user._id}
            <Tooltip content={$t("app.main.groups.owner")}>
                <BxCrown size={20} />
            </Tooltip>
        {/if}
        {#if alert}
            <div class="alert" data-style={alert}>
                {alertCount}
            </div>
        {/if}
        {#if !isTouchscreenDevice && channel}
            <IconButton class="icon" on:click={(e)=>{
                e.stopPropagation();
                channel && modalController.push({type: "close_dm", target: channel})
            }}>
                <BxX size={24} />
            </IconButton>
        {/if}
    </div>
</div>
