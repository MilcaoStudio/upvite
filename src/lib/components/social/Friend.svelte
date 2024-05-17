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
    <UserIcon target={user} size={38} onClick={()=>modalController.push({type: "user_profile", user_id: user._id})}/>
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
        border: 1px solid rgb(var(--secondary-background-rgb), 0.9);
        border-radius: var(--border-radius);
        display: flex;
        text-align: center;
        align-items: center;
        padding: 2px 0px 2px 16px;
        gap: 12px;
    }
    .Friend > :global(*) {
        
    }
    .Actions{
        margin-left: auto;
    }
</style>