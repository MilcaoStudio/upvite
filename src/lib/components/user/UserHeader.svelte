<script lang="ts">
    import { run } from 'svelte/legacy';

    import { User, UserProfile } from "stoat.js";
    import UserIcon from "./UserIcon.svelte";
    interface Props {
        user: User | undefined;
        placeholderProfile?: UserProfile | undefined;
        profile: UserProfile | undefined;
        action?: import('svelte').Snippet;
    }

    let {
        user,
        placeholderProfile = undefined,
        profile,
        action
    }: Props = $props();
    let backgroundURL: string | undefined = $state();
    
    run(() => {
        if (profile) {
            backgroundURL = profile.animatedBannerURL;
        } else if (placeholderProfile) {
            backgroundURL = placeholderProfile.animatedBannerURL;
        }
    });
</script>

<div
    class="userHeader"
    style="--banner-url: {backgroundURL ? `url(${backgroundURL})` : ''}"
>
    <div class="profile">
        <div>
            <UserIcon target={user} size={80} animate status />
            <h2>{user?.username}</h2>
        </div>
        <div class="action">
            {@render action?.()}
        </div>
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
        background-image: linear-gradient(
                rgba(0, 0, 0, 0.2),
                rgba(0, 0, 0, 0.35),
                rgba(var(--secondary-background-rgb), 1)
            ),
            var(--banner-url);
        flex-direction: column;
        max-width: 620px;
        max-height: 200px;
        height: 100vh;
        background-size: cover;
        background-position: center;
        border-radius: 0px var(--border-radius-inner) 0px
            var(--border-radius-inner);
    }
    .profile {
        display: flex;
        gap: 16px;
        justify-content: space-between;
        align-items: baseline;
    }

    .action {
        border-radius: var(--border-radius);
        padding: 3px;
        background-color: #474545;
    }
</style>
