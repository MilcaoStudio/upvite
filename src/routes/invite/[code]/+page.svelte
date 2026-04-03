<script lang="ts">
    import { goto, pushState } from "$app/navigation";
    import { takeError } from "$lib";
    import Category from "$lib/components/atoms/Category.svelte";
    import Error from "$lib/components/atoms/Error.svelte";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import { Button } from "fluent-svelte";
    import { API, PublicChannelInvite, ServerPublicInvite } from "stoat.js";
    import BxArrowBack from "svelte-boxicons/BxArrowBack.svelte";
    import { _ } from "svelte-i18n";
    import "../../../styles/invite.css";
    import TextSvelte from "$lib/i18n/TextSvelte.svelte";
    import { translate } from "$lib/i18n";
    import ServerIcon from "$lib/components/ServerIcon.svelte";
    import UserIcon from "$lib/components/user/UserIcon.svelte";
    import { useClient, useSession } from '$lib/components/client/ClientContext.svelte';
    import { useState } from '$lib/components/state/StateContext.svelte';
    import type { PageData } from "./$types";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

    const code = $derived(data.code);
    const session = useSession();
    const client = useClient();
    const layout = useState().layout;

    let processing = $state(false);
    let error= $state<string>();
    let invite = $state<PublicChannelInvite>();


    async function fetchInvite(code: string): Promise<PublicChannelInvite> {
        return client.api.get(`/invites/${code as ""}`).then((result) => PublicChannelInvite.from(client, result));
    }
    function isServerInvite(invite?: PublicChannelInvite): invite is ServerPublicInvite {
        return invite?.type == "Server";
    }
    $effect(() => {
        if (!invite) {
            fetchInvite(code).then((result)=>(invite=result)).catch((reason)=>error = takeError(reason));
        }
    });
</script>

{#if !invite}
    <div class="preloader">
        <!--<RequiresOnline>-->
        {#if error}
            <div class="invite" style:width="100%" style:height="100%">
                <div class="details">
                    <h1>{$_("app.special.invite.invalid")}</h1>
                    <h2>{$_("app.special.invite.invalid_desc")}</h2>
                    <div style:cursor="pointer">
                        <Button variant="standard">
                            <BxArrowBack
                                size={32}
                                on:click={() =>
                                    pushState(layout.getLastPath(), {})}
                            />
                        </Button>
                    </div>
                </div>
            </div>
        {:else}
            <Preloader type="spinner" />
        {/if}
        <!--</RequiresOnline>-->
    </div>
{:else if invite.type == "Group"}
    <!--TODO: Implement group invite-->
    <h1>Unimplemented!</h1>
{:else if isServerInvite(invite)}
    <div
        class="invite"
        style:background={invite.serverBanner
            ? `url('${invite.serverBanner.originalUrl}')`
            : null}
    >
        <div class="leave">
            <BxArrowBack
                size={32}
                on:click={() => goto(layout.getLastPath())}
            />
        </div>

        {#if !processing}
            <div class="icon">
                <!--ServerIcon-->
                <ServerIcon
                    attachment={invite.serverIcon}
                    server_name={invite.serverName}
                    size={64}
                />
            </div>
        {/if}

        <div class="details">
            {#if processing}
                <Preloader type="ring" />
            {:else}
                <h1>{invite.serverName}</h1>
                <h2>
                    #{invite.channelName} •{" "}
                    {translate("app.special.invite.user_count", {
                        member_count: invite.memberCount,
                    })}
                </h2>
                <h3>
                    {#snippet invitedBy()}
                    {#if isServerInvite(invite)}
                        <span style:display="inline-flex">
                            <UserIcon size={24} attachment={invite.userAvatar}></UserIcon>
                            {invite.userName}
                        </span>
                    {/if}
                    {/snippet}
                    <TextSvelte
                        id="app.special.invite.invited_by"
                        fields={{
                            user: invitedBy,
                        }}
                    />
                </h3>
                <Category><Error {error} /></Category>
                <Button
                    variant="standard"
                    on:click={async () => {
                        if (!session) {
                            return goto("/login?invite=" + code);
                        }
                        processing = true;
                        try {
                            if (!isServerInvite(invite)) {
                                throw TypeError("Invite has invalid format");
                            }
                            await invite.join();
                            goto(
                                `/server/${invite.serverId}/channel/${invite.channelId}`,
                            );
                        } catch (err) {
                            error = takeError(err);
                        } finally {
                            processing = false;
                        }
                    }}
                >
                    {#if session}
                        {$_("app.special.invite.accept")}
                    {:else}
                        {$_("app.special.invite.login")}
                    {/if}
                </Button>
            {/if}
        </div>
    </div>
{/if}
