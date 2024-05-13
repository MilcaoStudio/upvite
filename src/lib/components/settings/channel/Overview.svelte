<script lang="ts">
    import Button from "$lib/components/atoms/Button.svelte";
    import TextAreaAutoSize from "$lib/components/atoms/TextAreaAutoSize.svelte";
    import Row from "$lib/components/atoms/layout/Row.svelte";
    import ChannelIcon from "$lib/components/channels/ChannelIcon.svelte";
    import InputBox from "$lib/components/form/InputBox.svelte";
    import FileUploader from "$lib/controllers/FileUploader.svelte";
    import { Checkbox } from "fluent-svelte";
    import type { Channel } from "revolt.js";
    import { t } from "svelte-i18n";
    export let channel: Channel;
    $: name = channel.name;
    $: description = channel.description;
    $: nsfw = channel.nsfw;
    $: changed = (name != channel.name) ||
        (description != channel.description) ||
        (nsfw != channel.nsfw);
    function save() {
        const changes: Record<string, string | boolean> = {};
        if (name) {
            changes.name = name;
        }
        if (description) {
            changes.description = description;
        }
        changes.nsfw = nsfw ?? false;
        channel.edit(changes).then((_) => (changed = false));
    }
</script>

<Row>
    <div>
        <ChannelIcon size={80} target={channel} animate />
        <FileUploader
            style={{
                type: "icon",
                previewURL: channel.generateIconURL({ max_side: 256 }, true),
                defaultPreview:
                    channel.channel_type == "Group"
                        ? "$lib/assets/group.png"
                        : undefined,
            }}
            fileType="icons"
            behavior={{
                type: "upload",
                onUpload(icon) {
                    return channel.edit({ icon });
                },
            }}
            maxFileSize={2_500_000}
            remove={() => channel.edit({ remove: ["Icon"] })}
        />
    </div>

    <div>
        <h3>
            {channel.channel_type === "Group"
                ? $t("app.main.groups.name")
                : $t("app.main.servers.channel_name")}
        </h3>
        <InputBox
            palette="secondary"
            type="text"
            value={name}
            max-length="32"
            onChange={(e) => {
                name = e.currentTarget.value;
            }}
        />
    </div>
</Row>
<h3>
    {channel.channel_type == "Group"
        ? $t("app.main.groups.description")
        : $t("app.main.servers.channel_description")}
</h3>
<TextAreaAutoSize
    maxRows={10}
    minHeight={60}
    maxLength={1024}
    value={description ?? ""}
    placeholder={"Set a description..."}
    onChange={(ev) => {
        description = ev.currentTarget.value;
    }}
/>
{#if channel.channel_type != "VoiceChannel"}
    <Checkbox bind:value={nsfw}>Set this channel to NSFW</Checkbox>
{/if}
<p>
    <Button palette="secondary" disabled={!changed} onClick={save}
        >{$t("app.special.modals.actions.save")}</Button
    >
</p>
