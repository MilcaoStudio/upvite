<script lang="ts">
    import UserProfile from "$lib/components/modals/UserProfile.svelte";
    import { useSession } from "$lib/controllers/ClientController";
    import FileUploader from "$lib/controllers/FileUploader.svelte";
    import { t } from "svelte-i18n";
    const session = useSession()!;
    const client = session.client!;
    const user = client.user!;
</script>
1
<UserProfile props={{}}></UserProfile>
2
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
<div class="test">heloooo</div>

<style>
    .test {
        width: 100%;
    }
</style>
