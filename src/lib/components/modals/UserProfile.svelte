<script lang="ts">
    import IconButton from "../atoms/input/IconButton.svelte";
    import Modal from "./Modal.svelte";
    import type { ModalProps } from "$lib/types/Modal";
    import { useSession } from "$lib/controllers/ClientController";
    import UserHeader from "../user/UserHeader.svelte";
    import Edit from "svelte-boxicons/BxEdit.svelte";
    import Envelope from "svelte-boxicons/BxEnvelope.svelte";
    import { mapError } from "$lib";
    import H3 from "../atoms/heading/H3.svelte";
    import Markdown from "$lib/markdown/Markdown.svelte";
    import { API } from "revolt.js";
    import { UserPermission } from "revolt.js/lib/esm/permissions/definitions";

    export let props: ModalProps<"user_profile">;
    const session = useSession()!;
    const client = session.client!;
    const user = client.users.get(props.user_id);
    let profile: API.UserProfile | undefined;
    $: {
        if (session.state == "Online" && !profile) {
            if (user?.permission! & UserPermission.ViewProfile) {
                user?.fetchProfile()
                    .then((p) => (profile = p))
                    .catch(mapError);
            }
        }
    }

    $: server = props.contextualServer && client.servers.get(props.contextualServer);
    let roles: {name?: string, colour?: string | null}[] = [];
    $: if (server && user) {
        server.fetchMember(user).then(member => member.orderedRoles ?? []).then(or => roles = or);
    }
    
</script>

<Modal {...props}>
    <div class="container" slot="override">
        <div class="userProfile">
            <UserHeader {user} placeholderProfile={props.placeholderProfile} {profile}>
                <svelte:fragment slot="action">
                    {#if user?.relationship == "User"}
                        <IconButton
                            href="/settings/profile"
                            onClick={props.onClose}
                        >
                            <Edit size={24} />
                        </IconButton>
                    {:else if user?.relationship == "Friend" || user?.bot}
                        <IconButton
                            href="/open/{user.id}"
                            onClick={props.onClose}
                        >
                            <Envelope size={24} />
                        </IconButton>
                    {:else if user?.relationship == "Outgoing"}
                        <IconButton onClick={() => user.removeFriend()}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus" xmlns="http://www.w3.org/2000/svg">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/>
                                <path d="M 18 21 L 22 16"/>
                                <path d="M 18 16 L 22 21"/>
                                <path d="M6 21v-2a4 4 0 0 1 4 -4h4"/>
                              </svg>
                        </IconButton>
                    {:else}
                        <IconButton onClick={() => user?.addFriend()}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus"
                                ><path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                /><path
                                    d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"
                                /><path d="M16 19h6" /><path
                                    d="M19 16v6"
                                /><path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
                            </svg>
                        </IconButton>
                    {/if}
                </svelte:fragment>
            </UserHeader>
            <div class="userContent">
                <div class="">
                    <div class="category"></div>
                    <div class="content">
                        {#if server}
                            <H3>Roles</H3>
                            {#each roles as role}
                                <div class="role">
                                    <span class="colour" style="--colour: {role.colour}" /> {role.name}
                                </div>
                            {/each}
                        {/if}
                        {#if profile?.content}
                            <H3>BIO</H3>
                            <Markdown content={profile.content} />
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</Modal>

<style>
    .container {
        -webkit-animation:
            svelte-1qibxfp-menu-open var(--fds-control-normal-duration)
                var(--fds-control-fast-out-slow-in-easing),
            svelte-1qibxfp-menu-shadow var(--fds-control-fast-duration)
                var(--fds-control-fast-out-slow-in-easing)
                var(--fds-control-normal-duration) forwards;
        animation:
            svelte-1qibxfp-menu-open var(--fds-control-normal-duration)
                var(--fds-control-fast-out-slow-in-easing),
            svelte-1qibxfp-menu-shadow var(--fds-control-fast-duration)
                var(--fds-control-fast-out-slow-in-easing)
                var(--fds-control-normal-duration) forwards;
        backdrop-filter: blur(2px);
        background: rgba(0, 0, 0, 0.5);
        min-height: 200px;
        max-width: min(100% - 50px, 560px);
        max-height: min(-20px + 100vh, 650px);
        margin: 20px;
        position: relative;
        display: flex;
        flex-direction: column;
        border-radius: var(--border-radius-inner);
        width: 100%;
        background-color: var(--tertiary-background);
        -webkit-backdrop-filter: blur(8px) !important;
        backdrop-filter: blur(8px) !important;
        z-index: 20 !important;
        background-color: rgba(
            var(--tertiary-background-rgb),
            max(0, 0.7)
        ) !important;
    }

    .content {
        padding: 1rem;
        font-size: 14px;
    }

    .colour {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--colour, gray);
    }
</style>
