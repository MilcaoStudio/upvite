<script lang="ts">
    import UserIcon from "$lib/components/user/UserIcon.svelte";
    import Username from "$lib/components/user/Username.svelte";
import { css, cx } from "@emotion/css";
    import type { Client } from "revolt.js";
    import { BxCog } from "svelte-boxicons";

    export let client: Client;
    $: user = client.user;
    const Base = cx("UserPanel", css`
        display: flex;
        justify-content: space-between;
        padding: 12px 8px;
        background: rgba(var(--primary-background-rgb), max(0, 0.35) );
        border-radius: var(--border-radius-inner);
        -webkit-backdrop-filter: blur(20px);
        backdrop-filter: blur(4px);
        width: 100%;
        z-index: 20;
        bottom: 0;
        position: absolute;

        .user {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
        }

        .user > div {
            display: flex;
            flex-direction: column;
        }
    `);
</script>

<div class={Base}>
    <div class="user">
        <UserIcon {user} size={24} />
        <div>
            <Username {user} />
            {user?.status?.text ?? "Connected"}
        </div>
        
    </div>
    <div>
        <!--TODO: Otros controles-->
        <a href="/settings">
            <BxCog size={24} />
        </a>
    </div>
</div>