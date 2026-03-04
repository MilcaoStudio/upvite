<script lang="ts">
    import { internalEmit } from "$lib/InternalEmitter";
    import { modalController } from "$lib/components/modals/ModalController";
    import type { Channel, ServerMember, User } from "stoat.js";
    import UserButton from "../items/UserButton.svelte";
    interface Props {
        member?: ServerMember | undefined;
        user?: User | undefined;
        context: Channel;
    }

    let { member = undefined, user = member?.user, context }: Props = $props();
    /**
     * Create user information from an user or member
     */
    export function userInformation(user?: User, member?: ServerMember) {
        return {
            username: member?.nickname ?? user?.displayName ?? "Unknown User",
            avatar: member?.animatedAvatarURL ?? user?.animatedAvatarURL,
            colour: member?.roleColour,
            id: member?.id.user || user?.id,
            user,
            member,
        };
    }
    let info = $derived(userInformation(user, member));
</script>

<UserButton
    user={info.user}
    margin
    {context}
    onClick={(e) => {
        if (!info.id) {
            return; // no effect
        }
        if (e.shiftKey) {
            internalEmit("MessageBox", "append", `<@${info.id}>`, "mention");
        } else {
            modalController.push({
                type: "user_profile",
                user_id: info.id,
            });
        }
    }}
/>
