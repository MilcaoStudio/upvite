<script context="module" lang="ts">
    import { state } from "$lib/State";
    import { useClient } from "$lib/controllers/ClientController";
    import type { API, User } from "revolt.js";
    import { routeInformation } from "../context/history";
    import fallback from "$lib/assets/user.png";
    import IconBase from "../IconBase.svelte";
    import { createEventDispatcher } from "svelte";
    import { page } from "$app/stores";

    export function useStatusColor(user?: User) {
        const theme = state.settings.theme;

        return user?.online && user?.status?.presence != "Invisible"
            ? user?.status?.presence == "Idle"
                ? theme.getVariable("status-away")
                : user?.status?.presence == "Focus"
                  ? theme.getVariable("status-focus")
                  : user?.status?.presence == "Busy"
                    ? theme.getVariable("status-busy")
                    : theme.getVariable("status-online")
            : theme.getVariable("status-invisible");
    }
</script>

<script lang="ts">
    export let target: User | undefined = undefined,
        attachment: any = undefined,
        size: number,
        status = false,
        animate = false,
        mask: string | undefined = undefined,
        hover = false,
        showServerIdentity = false,
        masquerade: API.Masquerade | null = null,
        innerRef: SVGElement | undefined = undefined,
        override: string | undefined = undefined,
        url: string | undefined = undefined,
        onClick: ((e: MouseEvent)=>void) | null = null;
    const client = useClient();
    const dispatcher = createEventDispatcher();
    $: if (masquerade?.avatar) {
        url = client.proxyFile(masquerade.avatar);
    } else if (override) {
        url = override;
    } else if (!url) {
        let override;
        if (target && showServerIdentity) {
            const server = $page.params.server;
            if (server) {
                const member = client.members.getKey({
                    server,
                    user: target._id,
                });

                if (member?.avatar) {
                    override = member?.avatar;
                }
            }
        }

        url =
            client.generateFileURL(
                override ?? target?.avatar ?? attachment ?? undefined,
                { max_side: 256 },
                animate,
            ) ?? (target ? target.defaultAvatarURL : fallback);
    }
</script>

<IconBase
    bind:ref={innerRef}
    width={size}
    height={size}
    {hover}
    borderRadius="--border-radius-user-icon"
    aria-hidden
    viewBox="0 0 32 32"
    {onClick}
    {...$$restProps}
>
    <foreignObject
        x="0"
        y="0"
        width="32"
        height="32"
        class="icon"
        mask={mask ?? (status ? "url(#user)" : undefined)}
    >
        <img src={url} alt="avatar" draggable={false} loading="lazy" />
    </foreignObject>
    {#if status}
    <circle
        cx="27"
        cy="27"
        r="5"
        fill={useStatusColor(target)}
    />
    {/if}
    <!--TODO: Voice indicator-->
</IconBase>
