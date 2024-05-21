<script lang="ts">
    import TextAreaAutoSize from "$lib/components/atoms/TextAreaAutoSize.svelte";
    import H3 from "$lib/components/atoms/heading/H3.svelte";
    import Column from "$lib/components/atoms/layout/Column.svelte";
    import Row from "$lib/components/atoms/layout/Row.svelte";
    import InputBox from "$lib/components/form/InputBox.svelte";
    import FileUploader from "$lib/controllers/FileUploader.svelte";
    import isEqual from "lodash.isequal";
    import { autorun } from "mobx";
    import type { Server } from "revolt.js";
    import { t } from "svelte-i18n";
    import Md from "svelte-boxicons/BxlMarkdown.svelte";
    import H5 from "$lib/components/atoms/heading/H5.svelte";
    import ComboBox from "$lib/components/form/ComboBox.svelte";
    import ChannelName from "$lib/components/channels/ChannelName.svelte";
    import Button from "$lib/components/atoms/Button.svelte";
    import ImageIconBase from "$lib/components/ImageIconBase.svelte";
    import { PersonPicture } from "fluent-svelte";

    export let server: Server;
    let name = server.name;
    let description = server.description ?? "";
    let systemMessages = server.system_messages;
    autorun(() => (name = server.name));
    autorun(() => (systemMessages = server.system_messages));
    let changed = false;
    function save() {
        const changes: Record<string, unknown> = {};
        if (name != server.name) changes.name = name;
        if (description != server.description)
            changes.description = description;
        if (!isEqual(systemMessages, server.system_messages))
            changes.system_messages = systemMessages ?? undefined;

        server.edit(changes);
        changed = false;
    }
    let events: [
        string,
        keyof {
            user_joined: string;
            user_left: string;
            user_kicked: string;
            user_banned: string;
        },
    ][] = [
        ["User Joined", "user_joined"],
        ["User Left", "user_left"],
        ["User Kicked", "user_kicked"],
        ["User Banned", "user_banned"],
    ];

    async function removeIcon() {
        server.edit({ remove: ["Icon"] });
    }

    async function removeBanner() {
        server.edit({ remove: ["Banner"] });
    }
</script>

<div>
    <Row gap="20px" centred>
        <PersonPicture alt={server.name} size={80} src={server.generateIconURL({ max_side: 256 }, true)} />
        <FileUploader
            style={{
                type: "icon",
                width: 80,
            }}
            behavior={{
                type: "upload",
                onUpload: (icon) => server.edit({ icon }).then(() => {}),
            }}
            remove={removeIcon}
            fileType="icons"
            maxFileSize={2_500_000}
        />
        <Column>
            <H3>{$t("app.main.servers.name")}</H3>
            <InputBox
                type="text"
                value={name}
                maxLength={32}
                palette="secondary"
                onChange={(e) => {
                    name = e.currentTarget.value;
                    if (name != server.name) changed = true;
                }}
            />
        </Column>
    </Row>
    <H3>{$t("app.main.servers.description")}</H3>
    <TextAreaAutoSize
        maxRows={10}
        minHeight={120}
        maxLength={1024}
        value={description}
        placeholder={"Add a topic..."}
        onChange={(ev) => {
            description = ev.currentTarget.value;
            if (description != server.description) changed = true;
        }}
    />
    <span>
        <Md size={24} />
        <H5>
            Server descriptions support Markdown formatting. <a
                href="https://support.revolt.chat/kb/interface/messages/formatting-your-messages"
                target="_blank"
                rel="noreferrer"
            >
                Learn more here
            </a>.
        </H5>
    </span>
    <hr />
    <H3>{$t("app.main.servers.custom_banner")}</H3>
    <Row gap="8px">
        {#if server.banner}
            <img
                alt="banner"
                src={server.generateBannerURL({ width: 1000 }, true)}
            />
        {/if}
        <FileUploader
            style={{ type: "banner", height: 160 }}
            behavior={{
                type: "upload",
                async onUpload(banner) {
                    server.edit({ banner });
                },
            }}
            fileType="banners"
            maxFileSize={6_000_000}
            remove={removeBanner}
        />
    </Row>

    <hr />
    <H3>{$t("app.settings.server_pages.overview.system_messages")}</H3>
    {#each events as [event_name, key] (key)}
        <p style="display:flex;gap:8px;align-items:center;">
            <span style="flex-shrink:0;flex:25%">{event_name}</span>
            <ComboBox
                value={systemMessages?.[key] ?? "disabled"}
                onChange={(ev) => {
                    if (!systemMessages) return;
                    changed = true;
                    const v = ev.currentTarget.value;
                    if (v == "disabled") {
                        const { [key]: _, ...other } = systemMessages;
                        systemMessages = other;
                    } else {
                        systemMessages = { ...systemMessages, [key]: v };
                    }
                }}
            >
                <option value="disabled">{$t("general.disabled")}</option>
                {#each server.channels.filter((c) => c && c.channel_type == "TextChannel") as channel (channel?._id)}
                    {#if channel}
                        <option value={channel._id}>
                            <ChannelName {channel} prefix />
                        </option>
                    {/if}
                {/each}
            </ComboBox>
        </p>
    {/each}

    <p>
        <Button onClick={save} palette="secondary" disabled={!changed}>
            {$t("app.special.modals.actions.save")}
        </Button>
    </p>
</div>
