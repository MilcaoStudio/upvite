<script lang="ts">
    import AutoComplete, {
        useAutoComplete,
    } from "$lib/components/Autocomplete.svelte";
    import TextAreaAutoSize from "$lib/components/atoms/TextAreaAutoSize.svelte";
    import H3 from "$lib/components/atoms/heading/H3.svelte";
    import H4 from "$lib/components/atoms/heading/H4.svelte";
    import UserHeader from "$lib/components/user/UserHeader.svelte";
    import { useSession } from "$lib/controllers/ClientController";
    import FileUploader from "$lib/controllers/FileUploader.svelte";
    import { autorun } from "mobx";
    import type { API } from "revolt.js";
    import { t } from "svelte-i18n";
    const session = useSession()!;
    const client = session.client!;
    const user = client.user!;
    let profile: API.UserProfile | undefined;
    function refreshProfile() {
        user.fetchProfile().then((p) => (profile = p ?? {}));
    }
    $: autorun(() => {
        if (!profile && session.state == "Online") {
            refreshProfile();
        }
    });

    function setContent(content?: string) {
        profile = { ...profile, content };
    }

    let {
        onChange,
        onKeyUp,
        onKeyDown,
        onFocus,
        onBlur,
        ...autoCompleteProps
    } = useAutoComplete(setContent, {
        users: { type: "all" },
    });
</script>

1
<!--<UserProfile props={{}}></UserProfile>-->
<UserHeader {user} {profile} />
2

<div class="adaptable-div">
    <div class="column">
        <h3>{$t("app.settings.pages.profile.profile_picture")}</h3>
        <FileUploader
            style={{
                type: "icon",
                defaultPreview: user.generateAvatarURL({ max_side: 256 }, true),
                previewURL: user.generateAvatarURL({ max_side: 256 }, true),
                width: 92,
                height: 92,
            }}
            fileType="avatars"
            behavior={{
                type: "upload",
                onUpload: (avatar) =>
                    client.users.edit({ avatar }).finally(refreshProfile),
            }}
            maxFileSize={4_000_000}
            remove={() => client.users.edit({ remove: ["Avatar"] })}
        />
    </div>

    <div class="column">
        <h3 class="background">
            {$t("app.settings.pages.profile.custom_background")}
        </h3>
        <FileUploader
            style={{
                type: "banner",
                height: 92,
                previewURL: profile?.background
                    ? client.generateFileURL(
                          profile.background,
                          { width: 1000 },
                          true,
                      )
                    : undefined,
            }}
            behavior={{
                type: "upload",
                async onUpload(background) {
                    client.users
                        .edit({ profile: { background } })
                        .finally(refreshProfile);
                },
            }}
            remove={() => client.users.edit({ remove: ["ProfileBackground"] })}
            fileType="backgrounds"
            maxFileSize={6_000_000}
        />
    </div>
</div>

<H3>{$t("app.settings.pages.profile.info")}</H3>
<AutoComplete detached {...autoCompleteProps} />
<TextAreaAutoSize
    maxRows={10}
    minHeight={200}
    maxLength={2000}
    value={profile?.content ?? ""}
    disabled={typeof profile == "undefined"}
    onChange={(ev) => {
        onChange(ev);
        setContent(ev.currentTarget.value);
        client.users.edit({profile: { content: profile?.content }});
    }}
    placeholder={$t(
        `app.settings.pages.profile.${
            typeof profile == "undefined" ? "fetching" : "placeholder"
        }`,
    )}
    {onKeyUp}
    {onKeyDown}
    {onFocus}
    {onBlur}
/>
<H4>Descriptions support Markdown formatting</H4>

<div class="test">heloooo</div>

<style>
    .test {
        width: 100%;
    }
    .adaptable-div {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 32px;
    }
</style>
