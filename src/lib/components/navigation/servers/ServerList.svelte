<script lang="ts">
    import { dndzone } from "svelte-dnd-action";
    import type { Client, Server } from "revolt.js";
    import type { INotificationChecker } from "revolt.js/dist/util/Unreads";
    import { isTouchscreenDevice } from "$lib";
    import { css, cx } from "@emotion/css";
    import Item from "./Item.svelte";
    import { useCustomReorder } from "$lib/dnd";
    import ListFooter from "./ListFooter.svelte";
    import ListHeader from "./ListHeader.svelte";

    export const active: string | undefined = undefined;
    export let createServer: ()=>void,
        client: Client,
        home: () => string = ()=>"/",
        servers: Server[],
        reorder: (items: Server[]) => void,
        permit: INotificationChecker;
    
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
    <ListHeader {client} {home} {permit} />
    <ListFooter {createServer}/>
    <div
        use:dndzone={{ items: servers }}
        on:finalize={useCustomReorder(reorder)}
    >
        {#each servers as server (server._id)}
            <Item item={server} {permit} />
        {/each}
    </div>
    
    <div class={Shadow}><div /></div>
    <!--TODO: Settings icon-->
</div>
