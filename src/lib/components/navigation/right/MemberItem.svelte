<script lang="ts">
    import { internalEmit } from "$lib/InternalEmitter";
    import { modalController } from "$lib/components/modals/ModalController";
    import type { Channel, User } from "revolt.js";
    import UserButton from "../items/UserButton.svelte";
    export let item: User, context: Channel;
</script>

<UserButton
    user={item}
    margin
    {context}
    onClick={(e) => {
        if (e.shiftKey) {
            internalEmit("MessageBox", "append", `<@${item._id}>`, "mention");
        } else {
            modalController.push({
                type: "user_profile",
                user_id: item._id,
            });
        }
    }}
/>
