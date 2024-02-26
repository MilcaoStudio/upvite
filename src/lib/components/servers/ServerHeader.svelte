<script lang="ts">
    import { css, cx } from "@emotion/css";
    import type { Server } from "revolt.js";
    import Tooltip from "../atoms/Tooltip.svelte";
    import { BxCheck } from "svelte-boxicons";

    export let server: Server, background = false;
    const ServerBanner = cx('ServerBanner', css`
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    background-size: cover;
    background-repeat: norepeat;
    background-position: center center;

    ${background ? `
        height: 120px;

        .container {
            background: linear-gradient(
                0deg,
                var(--secondary-background),
                transparent
            );
        }` : `
            background-color: var(--secondary-header);
        `}

    .container {
        height: var(--header-height);

        display: flex;
        align-items: center;
        padding: 0 14px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
    const bannerURL = server.generateBannerURL({ width: 480 });

</script>

<div class={ServerBanner} style:background={bannerURL ? `url('${bannerURL}')` : undefined}>
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
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="title" on:click={() =>{}} on:keydown={null} role="button" tabindex=0>
            {server.name}
        </a>

        <!--TODO: link to server settings-->
    </div>
</div>