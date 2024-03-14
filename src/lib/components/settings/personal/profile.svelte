<script lang="ts">
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
</script>

1
<!--<UserProfile props={{}}></UserProfile>-->
<UserHeader {user} placeholderProfile={profile} />
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
                onUpload: (avatar) => client.users.edit({ avatar }),
            }}
            maxFileSize={4_000_000}
            remove={() => client.users.edit({ remove: ["Avatar"] })}
        />
    </div>
    
    <div class="column">
        <h3 class="background">{$t("app.settings.pages.profile.custom_background")}</h3>
        <FileUploader
            style={{
                type: "banner",
                height: 92,
                previewURL: profile?.background
                    ? client.generateFileURL(profile.background, { width: 1000 }, true)
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

<div class="test">heloooo</div>

<style>
    .test {
        width: 100%;
    }
    .adaptable-div{
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 32px;
    }
    
</style>
