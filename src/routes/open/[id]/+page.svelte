<script lang="ts">
    import Header from "$lib/components/atoms/Header.svelte";
    import { useSession } from "$lib/controllers/ClientController";
    import { t } from "svelte-i18n";
    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";
    import { modalController } from "$lib/components/modals/ModalController";

    export let data: PageData;
    const session = useSession();
    const client = session?.client!;
    $: id = data.id;
    $: {
        if (id == "saved") {
            for (const channel of client.channels.values()) {
                if (channel?.channel_type == "SavedMessages") {
                    goto(`/channel/${channel._id}`);
                    break;
                }
            }

            client
                .user!.openDM()
                .then((channel) => goto(`/channel/${channel?._id}`))
                .catch((error) => {
                    modalController.push({
                        type: "error",
                        error,
                    });
                    goto("/");
                });
        }

        if (client.users.has(id)) {
            const channel = [...client.channels.values()].find(
                (channel) =>
                    channel?.channel_type == "DirectMessage" &&
                    channel.recipient_ids!.includes(id),
            )?._id;
            if (channel) {
                goto(`/channel/${channel}`);
            } else {
                client.users
                    .get(id)
                    ?.openDM()
                    .then((channel) => goto(`/channel/${channel?._id}`))
                    .catch((error) => {
                        modalController.push({
                            type: "error",
                            error,
                        });
                        goto("/");
                    });
            }
        }
    }
</script>

<Header palette="primary">{$t("general.loading")}</Header>