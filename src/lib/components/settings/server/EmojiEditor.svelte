<script lang="ts">
    import IconButton from "$lib/components/atoms/input/IconButton.svelte";
    import InputBox from "$lib/components/form/InputBox.svelte";
    import UserShort from "$lib/components/user/UserShort.svelte";
    import type { Emoji, Server } from "stoat.js";
    import BxX from "svelte-boxicons/BxX.svelte";

    export let emoji: Emoji, server: Server;
    let mouseenter = false;
    let editable = server.havePermission("ManageCustomisation");

    async function onNameChange(
        ev: Event & { currentTarget: HTMLInputElement },
    ) {}
</script>

<div
    role="row"
    tabindex="0"
    class="EmojiInfo"
    on:mouseenter={() => (mouseenter = true)}
    on:mouseleave={() => (mouseenter = false)}
>
    <img class="preview icon" src={emoji.url} alt={emoji.name} />
    {#if mouseenter && editable}
        <div class="label">
            :<InputBox
                padding={false}
                type="text"
                onChange={onNameChange}
                value={emoji.name}
                maxlength="32"
            />
        </div>
        <div class="label">
            <UserShort user={emoji.creator} />
            <IconButton onClick={() => emoji.delete()}>
                <BxX size={20} />
            </IconButton>
        </div>
    {:else}
        <span class="label">:{emoji.name}:</span>
        <div class="label">
           <UserShort user={emoji.creator} /> 
        </div>
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
