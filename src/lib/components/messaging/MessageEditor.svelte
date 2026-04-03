<script lang="ts">
    import type { Message } from "stoat.js";
    import { modalController } from "../modals/ModalController";
    import Autocomplete, { useAutoComplete } from "../Autocomplete.svelte";
    import { isTouchscreenDevice } from "$lib";
    import TextAreaAutoSize from "../atoms/TextAreaAutoSize.svelte";

    interface Props {
        message: Message;
        onFinish: () => void;
    }

    let { message, onFinish }: Props = $props();
    let content = $derived(message.content);

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
    } = $derived(useAutoComplete((v) => setContent(v ?? ""), {
        users: { type: "channel", id: message.channel!.id },
        channels:
            message.channel!.type == "TextChannel"
                ? { server: message.channel!.serverId }
                : undefined,
    }));
</script>

<svelte:document
    onkeyup={(e) =>
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
            onChange(ev.currentTarget.value);
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
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_missing_attribute -->
        escape to <a onclick={onFinish}>cancel</a> &middot; enter to{" "}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_missing_attribute -->
        <a onclick={save}>save</a>
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
