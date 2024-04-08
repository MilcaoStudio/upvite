<script lang="ts">
    import { goto } from "$app/navigation";
    import type { User } from "revolt.js";
    import Plus from "svelte-boxicons/BxPlus.svelte";
    import X from "svelte-boxicons/BxX.svelte";
    import Envelope from "svelte-boxicons/BxEnvelope.svelte";
    import { modalController } from "../modals/ModalController";
    import UserIcon from "../user/UserIcon.svelte";
    import Username from "../user/Username.svelte";
    import IconButton from "../atoms/input/IconButton.svelte";

    export let user: User;
</script>

<div class="Friend">
    <UserIcon target={user} size={60} onClick={()=>modalController.push({type: "user_profile", user_id: user._id})}/>
    <Username {user} />
    <div class="Actions">
        <IconButton shape="circle" onClick={()=>{
            user.relationship == "Friend"
                ? modalController.push({
                    type: "unfriend_user",
                    target: user,
                })
                : user.removeFriend()
        }}>
            <X size={24} /> 
         </IconButton>
        {#if user.relationship == "Incoming"}
        <IconButton shape="circle" onClick={()=>user.addFriend()}>
            <Plus size={24} />
        </IconButton>
        {:else if user.relationship == "Friend"}
        <IconButton shape="circle" onClick={()=>goto(`/open/${user._id}`)}>
            <Envelope size={24} />
        </IconButton>
        {/if}
    </div>
</div>

<style>
    .Friend {
        border: 1px solid var(--secondary-foreground);
        border-radius: var(--border-radius);
        padding: 12px;
        display: flex;
        flex-direction: column;
        text-align: center;
    }
    .Friend > :global(*) {
        margin: auto;
    }
</style>