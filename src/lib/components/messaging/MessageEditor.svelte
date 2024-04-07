<script lang="ts">
    import type { Message } from "revolt.js";
    import { modalController } from "../modals/ModalController";
    import Autocomplete, { useAutoComplete } from "../Autocomplete.svelte";
    import { isTouchscreenDevice } from "$lib";
    import TextAreaAutoSize from "../atoms/TextAreaAutoSize.svelte";

    export let message: Message, onFinish: () => void;
    let content = message.content ?? "";

    function setContent(c: string) {
        content = c;
    }

    async function save() {
        onFinish();
        if (!content.length) {
            modalController.push({
                type: "delete_message",
                target: message,
            });
        } else if (content != message.content) {
            await message.edit({
                content,
            });
        }
    }

    let {
        onChange,
        onKeyUp,
        onKeyDown,
        onFocus,
        onBlur,
        ...autoCompleteProps
    } = useAutoComplete((v) => setContent(v ?? ""), {
        users: { type: "channel", id: message.channel!._id },
        channels:
            message.channel!.channel_type == "TextChannel"
                ? { server: message.channel!.server_id! }
                : undefined,
    });
</script>

<svelte:document
    on:keyup={(e) =>
        e.key == "Escape" && !modalController.isVisible && onFinish()}
/>

<div class="Editor">
    <Autocomplete detached {...autoCompleteProps} />
    <TextAreaAutoSize
        forceFocus
        maxRows={10}
        value={content}
        maxLength={2000}
        padding="var(--message-box-padding)"
        onChange={(ev) => {
            onChange(ev);
            setContent(ev.currentTarget.value);
        }}
        onKeyDown={(e) => {
            if (onKeyDown(e)) return;

            if (!e.shiftKey && e.key == "Enter" && !isTouchscreenDevice) {
                e.preventDefault();
                save();
            }
        }}
        {onKeyUp}
        {onFocus}
        {onBlur}
    />
    <span class="caption">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        escape to <a on:click={onFinish}>cancel</a> &middot; enter to{" "}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a on:click={save}>save</a>
    </span>
</div>

<style>
    .Editor {
        display: flex;
        flex-direction: column;
    }

    .caption {
        padding: 2px;
        font-size: 11px;
        color: var(--tertiary-foreground);
    }

    .caption a {
        cursor: pointer;
    }
    .caption a:hover {
        text-decoration: underline;
    }
</style>
