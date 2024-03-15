<script lang="ts">
    import { useClient, useSession } from "$lib/controllers/ClientController";
    import { UserPermission, type API, User } from "revolt.js";
    import IconButton from "../atoms/input/IconButton.svelte";
    import UserIcon from "./UserIcon.svelte";
    import Username from "./Username.svelte";
    export let user: User | undefined, placeholderProfile: API.UserProfile | undefined;
    const session = useSession()!;
    const client = useClient();
    let backgroundURL: string | undefined;
    let profile: API.UserProfile | undefined;
    $: {
        if (session.state == "Online" && !profile) {
            if (user?.permission! & UserPermission.ViewProfile) {
                user?.fetchProfile().then(p=>profile=p).catch(()=>{});
            }
        }
    }
    $: if (profile && profile.background) {
        backgroundURL = client.generateFileURL(profile.background, {width: 1000}, true)
    } else {
        placeholderProfile?.background && (backgroundURL = client.generateFileURL(placeholderProfile.background, {width: 1000}, true))
    }
</script>
<div class="userHeader" style="--banner-url: {backgroundURL ? `url(${backgroundURL})` : ""}">
    <div class="profile">
        <div>
            <UserIcon target={user} size={80} animate status />
            <h2>{user?.username}</h2>

        </div>
        
        <IconButton
            ><svg
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
                /><path d="M16 19h6" /><path d="M19 16v6" /><path
                    d="M6 21v-2a4 4 0 0 1 4 -4h4"
                /></svg
            ></IconButton
        >
    </div>
    <div class="medals"></div>
    <div class="tabs"></div>
</div>

<style>
    .userHeader {
        -webkit-box-flex: 1;
        flex-grow: 1;
        padding: 1rem 1rem 1rem;
        overflow-y: auto;
        font-size: 0.9375rem;
        display: flex;
        background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.35), rgba(var(--secondary-background-rgb), 1)), var(--banner-url);
        flex-direction: column;
        max-width: 620px;
        max-height: 200px;
        height: 100vh;
        background-size: cover;
        background-position: center;
        border-radius: 0px var(--border-radius-inner) 0px var(--border-radius-inner);
    }
    .profile {
        display: flex;
        gap: 16px;
        justify-content: space-between;
        align-items: baseline;
    }
</style>