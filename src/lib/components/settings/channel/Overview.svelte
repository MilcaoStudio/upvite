<script lang="ts">
    import Button from "$lib/components/atoms/Button.svelte";
    import TextAreaAutoSize from "$lib/components/atoms/TextAreaAutoSize.svelte";
    import Row from "$lib/components/atoms/layout/Row.svelte";
    import ChannelIcon from "$lib/components/channels/ChannelIcon.svelte";
    import InputBox from "$lib/components/form/InputBox.svelte";
    import FileUploader from "$lib/controllers/FileUploader.svelte";
    import { Checkbox } from "fluent-svelte";
    import type { API, Channel } from "stoat.js";
    import { t } from "svelte-i18n";
    interface Props {
        channel: Channel;
    }

    let { channel }: Props = $props();
    let editable = $derived(channel.havePermission("ManageChannel"));
    let name = $derived(channel.name);
    let description = $derived(channel.description);
    let nsfw = $derived(channel.mature);
    let changed = $derived(name != channel.name ||
        description != channel.description ||
        nsfw != channel.mature);
    
    function save() {
        const changes: API.DataEditChannel = {};
        if (name) {
            changes.name = name;
        }
        if (description) {
            changes.description = description;
        }
        changes.nsfw = nsfw ?? false;
        channel.edit(changes).then((_) => (changed = false));
        changed = false;
    }
</script>

<Row gap="32px">
    <div>
        <ChannelIcon size={80} target={channel} animate />
        {#if editable}
            <FileUploader
                style={{
                    type: "icon",
                    previewURL: channel.animatedIconURL,
                    defaultPreview:
                        channel.type == "Group"
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
        {/if}
    </div>

    <div>
        <h3>
            {channel.type == "Group"
                ? $t("app.main.groups.name")
                : $t("app.main.servers.channel_name")}
        </h3>
        <InputBox
            palette="secondary"
            type="text"
            disabled={!editable}
            value={name}
            maxlength={32}
            onChange={(e) => {
                name = e.currentTarget.value;
            }}
        />
    </div>
</Row>
<h3>
    {channel.type == "Group"
        ? $t("app.main.groups.description")
        : $t("app.main.servers.channel_description")}
</h3>
<TextAreaAutoSize
    maxRows={10}
    minHeight={60}
    maxLength={1024}
    disabled={!editable}
    value={description ?? ""}
    placeholder={"Set a description..."}
    onChange={(ev) => {
        description = ev.currentTarget.value;
    }}
/>
<Checkbox disabled={!editable} bind:value={nsfw}>
    Set this channel to NSFW
</Checkbox>
{#if editable}
    <p>
        <Button palette="secondary" disabled={!changed} onclick={save}>
            {$t("app.special.modals.actions.save")}
        </Button>
    </p>
{/if}
