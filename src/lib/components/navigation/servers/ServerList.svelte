<script lang="ts">
    import { dndzone } from "svelte-dnd-action";
    import type { Client, Server } from "revolt.js";
    import type { INotificationChecker } from "revolt.js/dist/util/Unreads";
    import { isTouchscreenDevice } from "$lib";
    import { css, cx } from "@emotion/css";
    import Item from "./Item.svelte";
    import { useCustomReorder } from "$lib/dnd";
    import ListFooter from "./ListFooter.svelte";

    export const active: string | undefined = undefined,
        client: Client | null = null,
        home: () => string = () => "/";
    export let createServer: ()=>void,
        servers: Server[],
        reorder: (items: Server[]) => void;
    
    servers = servers.map((s)=>{
        Object.defineProperty(s, 'id', {value: s._id});
        return s
    })
    const Base = cx(
        "ServerList",
        css`
            width: 56px;
            display: flex;
            flex-direction: column;

            .list {
                flex-grow: 1;
                scrollbar-width: none;
            }

            .list::-webkit-scrollbar {
                width: 0;
                height: 0;
            }

            ${isTouchscreenDevice ? `padding-bottom: 50px;` : ""}
        `,
    );
    const Shadow = cx(
        "Shadow",
        css`
            height: 0;
            z-index: 1;
            display: relative;

            div {
                height: 12px;
                margin-top: -12px;
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
    <div
        use:dndzone={{ items: servers }}
        on:finalize={useCustomReorder(reorder)}
    >
        {#each servers as server (server._id)}
            <Item item={server} />
        {/each}
    </div>
    <ListFooter {createServer}/>
    <div class={Shadow}><div /></div>
    <!--TODO: Settings icon-->
</div>
