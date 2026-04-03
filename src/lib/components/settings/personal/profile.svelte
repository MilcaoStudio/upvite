<script lang="ts">
    import AutoComplete, {
        useAutoComplete,
    } from "$lib/components/Autocomplete.svelte";
    import TextAreaAutoSize from "$lib/components/atoms/TextAreaAutoSize.svelte";
    import H3 from "$lib/components/atoms/heading/H3.svelte";
    import H4 from "$lib/components/atoms/heading/H4.svelte";
    import { useClient } from "$lib/components/client/ClientContext.svelte";
    import UserHeader from "$lib/components/user/UserHeader.svelte";
    import FileUploader from "$lib/controllers/FileUploader.svelte";
    import type { UserProfile } from "stoat.js";
    import { t } from "svelte-i18n";
    const client = useClient();
    const user = client.user!;
    let profile: UserProfile | undefined = $state();
    let profileContent: string | undefined;
    async function refreshProfile() {
        const result = await user.fetchProfile();
        profile = result;
        profileContent = result.content;
    }
    $effect(() => {
        if (!profile) {
            refreshProfile();
        }
    });

    function setContent(content?: string) {
        profileContent = content;
    }

    let {
        onchange,
        onkeyup,
        onkeydown,
        onfocus,
        onblur,
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
                defaultPreview: user.animatedAvatarURL,
                previewURL: user.animatedAvatarURL,
                width: 92,
                height: 92,
            }}
            fileType="avatars"
            behavior={{
                type: "upload",
                onUpload: (avatar) =>
                    user.edit({ avatar }).finally(refreshProfile),
            }}
            maxFileSize={4_000_000}
            remove={() => user.edit({ remove: ["Avatar"] })}
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
                previewURL: profile?.animatedBannerURL,
            }}
            behavior={{
                type: "upload",
                async onUpload(background) {
                    user
                        .edit({ profile: { background } })
                        .finally(refreshProfile);
                },
            }}
            remove={() => user.edit({ remove: ["ProfileBackground"] })}
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
        onchange(ev.currentTarget.value);
        setContent(ev.currentTarget.value);
        // TODO: DEBOUNCE
        user.edit({profile: { content: profile?.content }});
    }}
    placeholder={$t(
        `app.settings.pages.profile.${
            typeof profile == "undefined" ? "fetching" : "placeholder"
        }`,
    )}
    onKeyUp={onkeyup}
    onKeyDown={onkeydown}
    onFocus={onfocus}
    onBlur={onblur}
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
