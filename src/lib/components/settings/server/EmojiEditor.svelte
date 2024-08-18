<script lang="ts">
    import IconButton from "$lib/components/atoms/input/IconButton.svelte";
import InputBox from "$lib/components/form/InputBox.svelte";
    import UserShort from "$lib/components/user/UserShort.svelte";
    import type { Emoji, Server } from "revolt.js";
    import BxX from "svelte-boxicons/BxX.svelte";

    export let emoji: Emoji, server: Server;
    let mouseenter = false;
    let editable = server.havePermission("ManageCustomisation");

    async function onNameChange(
        ev: Event & { currentTarget: HTMLInputElement },
    ) {
        if (!ev.currentTarget?.value) {
            return;
        }
        const value = ev.currentTarget.value;
        if (value == emoji.name) {
            return;
        }
        try {
            if (!/^[a-z0-9_]+$/.test(value)){
                throw new Error("Invalid emoji name");
            }
            await server.client.api.put(`/custom/emoji/${emoji._id}`, {
            name: value,
            parent: { type: "Server", id: server._id },
        });
            emoji.name = value;
        } catch (error) {
            ev.currentTarget.value = emoji.name;
        }
        
    }
</script>

<div
    role="row"
    tabindex="0"
    class="EmojiInfo"
    on:mouseenter={() => (mouseenter = true)}
    on:mouseleave={() => (mouseenter = false)}
>
    <img class="preview" src={emoji.imageURL} alt={emoji.name} />
    {#if mouseenter && editable}
        :<InputBox type="text" onChange={onNameChange} value={emoji.name} maxlength=32 size=8 />:
        <UserShort user={emoji.creator} />
        <IconButton onClick={()=>emoji.delete()}>
            <BxX size={20} />
        </IconButton>
    {:else}
        <span>:{emoji.name}:</span>
        <UserShort user={emoji.creator} />
    {/if}
</div>

<style>
    .EmojiInfo {
        display: flex;
        place-items: center;
        padding: 8px;
        gap: 16px;
    }

    .preview {
        width: 32px;
        height: 32px;
        object-fit: contain;
        border-radius: var(--border-radius);
    }
</style>
