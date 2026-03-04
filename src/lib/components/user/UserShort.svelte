<script lang="ts">
    import type { API, User } from "stoat.js";
    import { modalController } from "../modals/ModalController";
    import { internalEmit } from "$lib/InternalEmitter";
    import UserIcon from "./UserIcon.svelte";
    import Username from "./Username.svelte";

    interface Props {
        user?: User | undefined;
        size?: number;
        prefixAt?: boolean;
        masquerade?: API.Masquerade | null;
        showServerIdentity?: boolean;
        [key: string]: any
    }

    let {
        user = undefined,
        size = 20,
        prefixAt = false,
        masquerade = null,
        showServerIdentity = false,
        ...rest
    }: Props = $props();
    const openProfile = () =>
        user &&
        modalController.push({ type: "user_profile", user_id: user.id });
    const handleUserClick = (e: MouseEvent) => {
        if (e.shiftKey && user?.id) {
            e.preventDefault();
            internalEmit("MessageBox", "append", `<@${user?.id}>`, "mention");
        } else {
            openProfile();
        }
    };
</script>

<div {...rest}>
    <UserIcon
        target={user}
        size={size ?? 24}
        {masquerade}
        onClick={handleUserClick}
        {showServerIdentity}
    />
    <Username
        {user}
        {prefixAt}
        {masquerade}
        onClick={handleUserClick}
        {showServerIdentity}
    />
</div>
