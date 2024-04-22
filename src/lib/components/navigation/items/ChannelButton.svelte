<script lang="ts">
  import { css, cx } from "@emotion/css";
  import type { Channel, User } from "revolt.js";
  import ChannelIcon from "../../channels/ChannelIcon.svelte";
  import ContextMenu from "$lib/components/context/ContextMenu.svelte";
  import "./Item.css";
    import UserIcon from "$lib/components/user/UserIcon.svelte";
    import { voiceState } from "$lib/voice/VoiceState";
    import { autorun } from "mobx";
    import Username from "$lib/components/user/Username.svelte";

  export let active = false,
    alert: "unread" | "mention" | undefined = undefined,
    alertCount = 0,
    channel: Channel,
    //user: User | undefined = undefined,
    compact = false,
    muted = false;
  let client = channel?.client;
  let participants: User[] = [];
  $: autorun(()=> participants = Array.from(voiceState.participants.keys()).map(id => client.users.get(id)).filter(u=>u) as User[]);
  const alerting = alert && !muted && !active;
</script>

{#if channel}
  {#if channel.channel_type != "DirectMessage"}
    <ContextMenu data={{ channel: channel._id, unread: !!alert }}>
      <div
        data-active={active}
        data-alert={alerting}
        data-muted={muted}
        aria-label={channel.name}
        class={cx("item", { ["compact"]: compact })}
        {...$$restProps}
      >
        <div class="avatar">
          <ChannelIcon target={channel} size={compact ? 24 : 32} />
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
      {#if channel.channel_type == "VoiceChannel"}
        <div>
          {#each participants as participant}
            <li><UserIcon target={participant} size={20} /><Username user={participant} showServerIdentity/></li>
          {/each}
        </div>
      {/if}
    </ContextMenu>
  {/if}
{/if}
