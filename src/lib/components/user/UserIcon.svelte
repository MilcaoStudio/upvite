<script module lang="ts">
    import { useClient } from "$lib/controllers/ClientController";
    import type { API, File, User } from "stoat.js";
    import fallback from "$lib/assets/user.png";
    import IconBase from "../IconBase.svelte";
    import { page } from "$app/stores";
    import { settings } from "$lib/stores/Settings";

    export function useStatusColor(user: User | null) {
        const theme = settings.theme;

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
    import { run } from 'svelte/legacy';

    interface Props {
        target?: User | null;
        attachment?: File | undefined;
        size: number;
        status?: boolean;
        animate?: boolean;
        mask?: string | undefined;
        hover?: boolean;
        showServerIdentity?: boolean;
        masquerade?: API.Masquerade | null;
        innerRef?: SVGElement | undefined;
        override?: string | undefined;
        onClick?: ((e: MouseEvent)=>void) | null;
        [key: string]: any
    }

    let {
        target = null,
        attachment = undefined,
        size,
        status = false,
        animate = false,
        mask = undefined,
        hover = false,
        showServerIdentity = false,
        masquerade = null,
        innerRef = $bindable(undefined),
        override = undefined,
        onClick = null,
        ...rest
    }: Props = $props();
    const client = useClient();

    let url: string | undefined = $state();
    run(() => {
        if (masquerade?.avatar) {
            url = client.proxyFile(masquerade.avatar);
        } else if (override) {
            url = override;
        } else if (!url) {
            let memberAvatarUrl;
            if (target && showServerIdentity) {
                const server = $page.params.server;
                if (server) {
                    const member = client.serverMembers.getByKey({server, user: target.id});
                    if (member?.avatar) {
                        memberAvatarUrl = animate ? member.animatedAvatarURL : member.avatarURL;
                    }
                }
            }
            let avatarUrl = animate ? target?.animatedAvatarURL : target?.avatarURL;
            url = memberAvatarUrl || avatarUrl || attachment?.createFileURL(animate) || fallback;
        }
    });
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
    {...rest}
>
    <foreignObject
        x="0"
        y="0"
        width="32"
        height="32"
        class="icon"
        mask={mask ?? (status ? "url(#user)" : undefined)}
    >
        <img src={url} height={size} alt="avatar" draggable={false} loading="lazy" />
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
