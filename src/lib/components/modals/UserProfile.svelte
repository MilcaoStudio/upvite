<script lang="ts">
    import IconButton from "../atoms/input/IconButton.svelte";
    import Modal from "./Modal.svelte";
    import type { ModalProps } from "$lib/types/Modal";
    import UserHeader from "../user/UserHeader.svelte";
    import Edit from "svelte-boxicons/BxEdit.svelte";
    import Envelope from "svelte-boxicons/BxEnvelope.svelte";
    import { ServerMember, UserPermission, UserProfile } from "stoat.js";
    import { mapError } from "$lib";
    import H3 from "../atoms/heading/H3.svelte";
    import Markdown from "$lib/markdown/Markdown.svelte";
    import UserBadges from "../user/UserBadges.svelte";
    import { useClient } from '../client/ClientContext.svelte';

    interface Props {
        props: ModalProps<"user_profile">;
    }

    let { props }: Props = $props();
    const client = useClient();
    let user = $derived(client.users.get(props.user_id));
    let profile: UserProfile | undefined = $state();
    $effect(() => {
        if (!profile) {
            if ((user?.permission || 0) & UserPermission.ViewProfile) {
                    user?.fetchProfile()
                        .then((p) => (profile = p))
                        .catch(mapError);
            }
        }
    });

    $effect(() => {
        if (!user) {
            client.users.fetch(props.user_id).then((u)=>(user = u)).catch(mapError);
        }
    });

    let server =
        $derived(props.contextualServer && client.servers.get(props.contextualServer));
    let roles: ServerMember["orderedRoles"] = $state([]);
    $effect(() => {
        if (server && user) {
            server
                .fetchMember(user)
                .then((member) => member.orderedRoles ?? [])
                .then((or) => (roles = or));
        }
    });
</script>

<Modal {...props}>
    {#snippet override()}
        <div >
            <div class="UserProfile">
                <UserHeader
                    {user}
                    placeholderProfile={props.placeholderProfile}
                    {profile}
                >
                    {#snippet action()}
                            
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
                                <IconButton onClick={() => user?.removeFriend()}>
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                        />
                                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                        <path d="M 18 21 L 22 16" />
                                        <path d="M 18 16 L 22 21" />
                                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
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
                        
                            {/snippet}
                </UserHeader>
                {#if user}
                    <div class="userContent">
                        <div class="">
                            <UserBadges {user} />
                            <div class="category"></div>
                            <div class="content">
                                {#if server}
                                    <H3>Roles</H3>
                                    {#each roles as role}
                                        <div class="role">
                                            <span
                                                class="colour"
                                                style="--colour: {role.colour}"
></span>
                                            {role.name}
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
                {/if}
            </div>
        </div>
    {/snippet}
</Modal>

<style>
    .UserProfile {
        display: flex;
        flex-direction: column;
    }

    .content {
        padding: 1rem;
        font-size: 14px;
        overflow: auto;
        max-height: 400px;
    }

    .colour {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--colour, gray);
    }
</style>
