<script lang="ts">
    import { page } from "$app/stores";
    import { useClient } from "$lib/controllers/ClientController";
    import { css, cx } from "@emotion/css";
    import { API, User } from "revolt.js";
    import BxTimeFive from "svelte-boxicons/BxTimeFive.svelte";
    import { t } from "svelte-i18n";

    export let user: User | null | undefined = undefined, prefixAt = false, masquerade: API.Masquerade | null = null, showServerIdentity: boolean | "both" = false, onClick: ((e: MouseEvent)=>void) | null = null;
    let username = (user as unknown as { display_name: string })?.display_name ??
            user?.username;
    let color = masquerade?.colour;
    let timed_out: Date | undefined;
    if (user && showServerIdentity) {
        const server_id = $page.params.server;
        if (server_id) {
            const client = useClient();
            const member = client.members.getKey({server: server_id, user: user._id,});
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
                    for (const [_, { colour }] of member.orderedRoles) {
                        if (colour) {
                            color = colour;
                        }
                    }
                }
            }
        }
    }
    let innerRef: HTMLSpanElement | undefined;
    const Name = cx('name', color  && (color.includes("gradient") ? css`
        background: ${color};
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    ` : css`color: ${color}`));
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<a href="" on:click={onClick}>
    <span class={Name} bind:this={innerRef} {...$$restProps} >
        {prefixAt ? "@" : ""}
        {masquerade?.name ?? username ?? $t("app.main.channel.unknown_user")}
    </span>
</a>
{#if timed_out}
    <BxTimeFive size={16} color="var(--secondary-foreground)" />
{/if}
<!--TODO: Bot badge -->