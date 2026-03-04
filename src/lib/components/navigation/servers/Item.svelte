<script module lang="ts">
  export const ItemContainer = cx(
    "ItemContainer",
    css`
      width: 56px;
      padding-left: 7px;
      padding-right: 7px;
      padding-bottom: 6px;
      cursor: pointer;
    `
  );
</script>

<script lang="ts">
  import { run } from 'svelte/legacy';

  import { InfoBadge, PersonPicture } from "fluent-svelte";
  import { css, cx } from "@emotion/css";
  import type { Server } from "stoat.js";
  import Tooltip from "$lib/components/atoms/Tooltip.svelte";
  import ContextMenu from "$lib/components/context/ContextMenu.svelte";
  interface Props {
    head?: boolean;
    item: Server;
    active?: boolean;
  }

  let { head = false, item, active = false }: Props = $props();
  const ItemContainer = cx(
    "ItemContainer",
    css`
      margin-top: auto;
      width: 56px;
      padding-left: 7px;
      padding-right: 7px;
      padding-bottom: 6px;
      cursor: pointer;
      
      ${head ? `padding-top: 6px;` : ``}
    `
  );
  const unread = item.unread;
  let iconUrl = item.icon?.previewUrl;
  run(() => {
    if (active) {
      console.debug("active", item.id);
    }
  });
  //const count = item.getMentions(permit).length;
</script>

<div class={ItemContainer}>
  <!--TODO: Show Swoosh component if active-->
  <Tooltip content={item.name} div right>
    <ContextMenu data={{ server: item.id, unread }}>
      <a href={`/server/${item.id}`}>
        <!--TODO: Custom component that includes unread slot-->
        <PersonPicture
          size={42}
          alt={item.name}
          src={iconUrl}
        />
      </a>
    </ContextMenu>
  </Tooltip>
</div>
