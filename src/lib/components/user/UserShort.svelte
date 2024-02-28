<script lang="ts">
    import type { API, User } from "revolt.js";
    import { modalController } from "../modals/ModalController";
    import { internalEmit } from "$lib/InternalEmitter";
    import UserIcon from "./UserIcon.svelte";
    import Username from "./Username.svelte";

    export let user: User | undefined = undefined, size = 20, prefixAt = false, masquerade: API.Masquerade | undefined = undefined, showServerIdentity = false;
    const openProfile = () => user &&
        modalController.push({ type: "user_profile", user_id: user._id });
    const handleUserClick = (e: MouseEvent) => {
        if (e.shiftKey && user?._id) {
            e.preventDefault();
            internalEmit("MessageBox", "append", `<@${user?._id}>`, "mention");
        } else {
            openProfile();
        }
    };
</script>

<UserIcon
    target={user}
    size={size ?? 24}
    masquerade={masquerade}
    onClick={handleUserClick}
    showServerIdentity={showServerIdentity}
/>
<Username
    {user}
    prefixAt={prefixAt}
    masquerade={masquerade}
    onClick={handleUserClick}
    showServerIdentity={showServerIdentity}
/>