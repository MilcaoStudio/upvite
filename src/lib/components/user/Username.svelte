<script lang="ts">
    import { page } from "$app/state";
    import { css, cx } from "@emotion/css";
    import { API, User } from "stoat.js";
    import BxTimeFive from "svelte-boxicons/BxTimeFive.svelte";
    import { t } from "svelte-i18n";
    import { useClient } from "../client/ClientContext.svelte";

    interface Props {
        user?: User | null | undefined;
        prefixAt?: boolean;
        masquerade?: API.Masquerade | null;
        showServerIdentity?: boolean | "both";
        onClick?: ((e: MouseEvent)=>void) | null;
        [key: string]: any
    }

    let {
        user = undefined,
        prefixAt = false,
        masquerade = null,
        showServerIdentity = false,
        onClick = null,
        ...rest
    }: Props = $props();
    let username = $derived((user as unknown as { display_name: string })?.display_name ??
            user?.username);
    let color = $derived(masquerade?.colour);
    let timed_out = $state<Date>();
    $effect(()=>{
        if (user && showServerIdentity) {
            const server_id = page.params.server;
            if (server_id) {
                const client = useClient();
                const member = client.serverMembers.getByKey({server: server_id, user: user.id});
                if (member) {
                    if (member.nickname) {
                        if (showServerIdentity == "both") {
                            username = `${member.nickname} (${username})`;
                        } else {
                            username = member.nickname;
                        }
                    }
    
                    if (member.timeout) {
                        timed_out = member.timeout;
                    }
    
                    if (!color) {
                        for (const {colour} of member.orderedRoles) {
                            if (colour) {
                                color = colour;
                            }
                        }
                    }
                }
            }
        }
    });
    let innerRef: HTMLSpanElement | undefined = $state();
    const Name = $derived(cx('name', color  && (color.includes("gradient") ? css`
        background: ${color};
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    ` : css`color: ${color}`)));
</script>

<!-- svelte-ignore a11y_invalid_attribute -->
<a href="" onclick={onClick}>
    <span class={Name} bind:this={innerRef} {...rest} >
        {prefixAt ? "@" : ""}
        {masquerade?.name ?? username ?? $t("app.main.channel.unknown_user")}
    </span>
</a>
{#if timed_out}
    <BxTimeFive size={16} color="var(--secondary-foreground)" />
{/if}
<!--TODO: Bot badge -->