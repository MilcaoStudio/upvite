<script lang="ts">
    import { css, cx } from "@emotion/css";
    import type { Server } from "stoat.js";
    import Tooltip from "../atoms/Tooltip.svelte";
    import BxCheck  from "svelte-boxicons/BxCheck.svelte";

    interface Props {
        server: Server;
    }

    let { server }: Props = $props();
    let bannerURL = server.bannerURL;

    const ServerBanner = cx('ServerBanner', css`
    margin: 8px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    

    ${bannerURL ? `
        height: var(--banner-height);
        justify-content: flex-end;

        .container {
            background: linear-gradient(
                0deg,
                var(--secondary-background),
                transparent
            );
        }` : `
        height: 48px;
        justify-content: center;
        `}

    .container {
        display: flex;
        padding: 0 16px;
        font-weight: 600;
        white-space: nowrap;
        gap: 8px;

        .title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex-grow: 1;

            cursor: pointer;
            color: var(--foreground);
        }
    }`);
</script>

<div class={ServerBanner} style:background={bannerURL ? `url('${bannerURL}') center/cover no-repeat` : undefined}>
    <div class="container">
        {#if server.flags && server.flags & 1}
            <Tooltip i18n="app.special.server-badges.official" placement="bottom-start">
                <svg width="20" height="20">
                    <image
                        xlink:href="/assets/badges/verified.svg"
                        height="20"
                        width="20"
                    />
                </svg>
            </Tooltip>
        {/if}
        {#if server.flags && server.flags & 2}
            <Tooltip i18n="app.special.server-badges.verified" placement="bottom-start">
                <svg width="20" height="20">
                    <image
                        xlink:href="/assets/badges/verified.svg"
                        height="20"
                        width="20"
                    />
                    <foreignObject x="2" y="2" width="15" height="15">
                        <BxCheck
                            size={15}
                            color="black"
                            strokeWidth={8}
                        />
                    </foreignObject>
                </svg>
            </Tooltip>
        {/if}
        <!--push modal server_info-->
        <!-- svelte-ignore a11y_missing_attribute -->
        <a class="title" onclick={() =>{}} onkeydown={null} role="button" tabindex=0>
            {server.name}
        </a>

        

        <!--TODO: link to server settings-->
    </div>
</div>

