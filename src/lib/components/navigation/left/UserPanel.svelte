<script lang="ts">
    import { page } from "$app/stores";
    import UserIcon from "$lib/components/user/UserIcon.svelte";
    import Username from "$lib/components/user/Username.svelte";
import { css, cx } from "@emotion/css";
    import type { Client } from "revolt.js";


    export let client: Client;
    $: demo = $page.data.demo || false;
    let user = client.user;
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
        <UserIcon target={user} size={24} status />
        <div>
            <Username {user} />
            {user?.status?.presence ?? "Connected"}
        </div>
        
    </div>
    <div>
        <!--TODO: Otros controles-->
        <a href={demo ? "/demo/settings": "/settings"} class="link__settings">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-settings">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              </svg>
        </a>
    </div>
</div>

<style>

.link__settings svg {
  transition: all 600ms ease-in-out;
}

.link__settings:hover svg {
  transform: rotate(30deg);
}

.link__settings:active svg {
  transform: rotate(360deg);
}

</style>