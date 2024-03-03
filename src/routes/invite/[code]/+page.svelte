<script lang="ts">
    import { goto, pushState } from "$app/navigation";
    import { takeError } from "$lib";
    import { state } from "$lib/State.js";
    import Category from "$lib/components/atoms/Category.svelte";
    import Error from "$lib/components/atoms/Error.svelte";
    import Preloader from "$lib/components/indicators/Preloader.svelte";
    import {
        useClient,
        useSession,
    } from "$lib/controllers/ClientController.js";
    import { Button } from "fluent-svelte";
    import { API } from "revolt.js";
    import { BxArrowBack } from "svelte-boxicons";
    import { _ } from "svelte-i18n";
    import "../../../styles/invite.css";
    import TextSvelte from "$lib/i18n/TextSvelte.svelte";
    import { translate } from "$lib/i18n";
    import ServerIcon from "$lib/components/ServerIcon.svelte";
    import UserIcon from "$lib/components/user/UserIcon.svelte";
    import { createElement } from "$lib/markdown/runtime/svelteRuntime";

    export let data;

    const code = data.code;
    const session = useSession();
    const client = useClient();
    const layout = state.layout;

    let processing = false;
    let error: string;
    let invite: API.InviteResponse;

    $: {
        if (!invite) {
            client
                .fetchInvite(code)
                .then((data) => (invite = data))
                .catch((err) => (error = takeError(err)));
        }
    }
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
{:else if invite.type == "Server"}
    <div
        class="invite"
        style:background={invite.server_banner
            ? `url('${client.generateFileURL(invite.server_banner)}')`
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
                    attachment={invite.server_icon}
                    server_name={invite.server_name}
                    size={64}
                />
            </div>
        {/if}

        <div class="details">
            {#if processing}
                <Preloader type="ring" />
            {:else}
                <h1>{invite.server_name}</h1>
                <h2>
                    #{invite.channel_name} •{" "}
                    {translate("app.special.invite.user_count", {
                        member_count: invite.member_count,
                    })}
                </h2>
                <h3>
                    <TextSvelte
                        id="app.special.invite.invited_by"
                        fields={{
                            user: createElement(
                                "span",
                                { style: "display:inline-flex;" },
                                createElement(UserIcon, {
                                    size: 24,
                                    attachment: invite.user_avatar,
                                }),
                                invite.user_name,
                            ),
                        }}
                    />
                </h3>
                <Category><Error {error} /></Category>
                <Button
                    variant="standard"
                    on:click={async () => {
                        if (!session) {
                            return goto("/");
                        }
                        processing = true;
                        try {
                            if (invite.type != "Server") {
                                throw TypeError("Invite has invalid format");
                            }
                            await client.joinInvite(invite);
                            goto(
                                `/server/${invite.server_id}/channel/${invite.channel_id}`,
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
