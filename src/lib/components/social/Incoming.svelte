<script lang="ts">
    import { useClient } from "$lib/controllers/ClientController";
    import type { User } from "revolt.js";
    import { modalController } from "../modals/ModalController";
    import UserIcon from "../user/UserIcon.svelte";
    import Username from "../user/Username.svelte";

    export let user: User;
</script>

<div class="Friend">
    <UserIcon target={user} size={60} onClick={()=>modalController.push({type: "user_profile", user_id: user._id})}/>
    <Username {user} />
    <div class="Actions">
        <button on:click={()=>user.removeFriend()}>Ignorar</button>
        <button on:click={()=>user.addFriend()}>Aceptar</button>
    </div>
</div>

<style>
    .Friend {
        border: 1px solid gold;
        border-radius: var(--border-radius);
        padding: 4px;
        display: flex;
        flex-direction: column;
    }
</style>