<script lang="ts">
    import { goto } from "$app/navigation";
    import { useClient } from "$lib/controllers/ClientController";
    import type { User } from "revolt.js";
    import { modalController } from "../modals/ModalController";
    import UserIcon from "../user/UserIcon.svelte";
    import Username from "../user/Username.svelte";

    const client = useClient();
    export let user: User;
</script>

<div class="Friend">
    <UserIcon target={user} size={60} onClick={()=>modalController.push({type: "user_profile", user_id: user._id})}/>
    <Username {user} />
    <div class="Actions">
        <button on:click={()=>goto(`/open/${user._id}`)}>Send message</button>
    </div>
</div>

<style>
    .Friend {
        border: 1px solid var(--secondary-foreground);
        border-radius: var(--border-radius);
        padding: 4px;
        display: flex;
        flex-direction: column;
    }
</style>