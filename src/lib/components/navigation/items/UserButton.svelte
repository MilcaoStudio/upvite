<script lang="ts">
    import { cx } from "@emotion/css";
    import type { Channel, User } from "stoat.js";
    import UserIcon from "../../user/UserIcon.svelte";
    import Username from "../../user/Username.svelte";
    import Tooltip from "../../atoms/Tooltip.svelte";
    import { t } from "svelte-i18n";
    import { isTouchscreenDevice } from "$lib";
    import { IconButton } from "fluent-svelte";
    import { modalController } from "../../modals/ModalController";
    import "./Item.css"
    import BxCrown from "svelte-boxicons/BxCrown.svelte";
    import BxX from "svelte-boxicons/BxX.svelte";
    import type { MouseEventHandler } from "svelte/elements";

    interface Props {
        active?: boolean;
        alert?: "unread" | "mention" | null;
        alertCount?: number;
        margin?: boolean;
        muted?: boolean;
        user: User | undefined;
        context?: Channel | undefined;
        channel?: Channel | undefined;
        onClick?: MouseEventHandler<HTMLDivElement> | null;
        [key: string]: any
    }

    let {
        active = false,
        alert = null,
        alertCount = 0,
        margin = false,
        muted = false,
        user,
        context = undefined,
        channel = undefined,
        onClick = null,
        ...rest
    }: Props = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    {...rest}
    onclick={onClick}
    class={cx("item", "user")}
    data-active={active}
    data-margin={margin}
    data-muted={muted}
    data-alert={typeof alert == "string"}
    data-online={typeof channel != undefined ||
        (user?.online && user.status?.presence != "Invisible")}
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
            {#if channel?.lastMessage?.content}
                {channel.lastMessage.content.slice(0, 32)}
            {:else}
                <!--<UserStatus user={user} tooltip />-->
            {/if}
        </div>
    </div>
    <div class="button">
        {#if context?.type == "Group" && context.ownerId == user?.id}
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
