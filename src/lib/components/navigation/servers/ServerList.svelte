<script lang="ts">
    import { dndzone } from "svelte-dnd-action";
    import type { Client, Server } from "stoat.js";
    import { css, cx } from "@emotion/css";
    import Item from "./Item.svelte";
    import { useCustomReorder } from "$lib/dnd";
    import ListFooter from "./ListFooter.svelte";
    import ListHeader from "./ListHeader.svelte";

    interface Props {
        active?: string | undefined;
        createServer: ()=>void;
        home?: () => string;
        servers: Server[];
        reorder: (items: Server[]) => void;
    }

    let {
        active = undefined,
        createServer,
        home = ()=>"/",
        servers,
        reorder
    }: Props = $props();
    const Base = cx(
        "ServerList",
        css`
            width: 56px;
            display: flex;
            flex-direction: column;
            scrollbar-width: none;
            overflow-y: scroll;
        `,
    );
    const Shadow = cx(
        "Shadow",
        css`
            height: 0;
            z-index: 1;
            margin-top: auto;
            display: relative;

            div {
                height: 18px;
                margin-top: -20px;
                display: absolute;
                background: linear-gradient(
                    to bottom,
                    transparent,
                    var(--background)
                );
            }
        `,
    );
</script>

<div class={Base}>
    <ListHeader {home} />
    <ListFooter {createServer}/>
    <div
        use:dndzone={{ items: servers }}
        onfinalize={useCustomReorder(reorder)}
    >
        {#each servers as server (server.id)}
            <Item item={server} active={server.id == active} />
        {/each}
    </div>
    
    <div class={Shadow}><div></div></div>
    <!--TODO: Settings icon-->
</div>
