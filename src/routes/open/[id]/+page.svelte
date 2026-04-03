<script lang="ts">
    import Header from "$lib/components/atoms/Header.svelte";
    import { t } from "svelte-i18n";
    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";
    import { modalController } from "$lib/components/modals/ModalController";
    import { useClient } from "$lib/components/client/ClientContext.svelte";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
    const client = useClient();
    let id = $derived(data.id);
    $effect(() => {
        if (id == "saved") {
            for (const channel of client.channels.values()) {
                if (channel?.type == "SavedMessages") {
                    goto(`/channel/${channel.id}`);
                    break;
                }
            }

            client
                .user?.openDM()
                .then((channel) => goto(`/channel/${channel?.id}`))
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
                    channel?.type == "DirectMessage" &&
                    channel.recipientIds.has(id),
            )?.id;
            if (channel) {
                goto(`/channel/${channel}`);
            } else {
                client.users
                    .get(id)
                    ?.openDM()
                    .then((channel) => goto(`/channel/${channel?.id}`))
                    .catch((error) => {
                        modalController.push({
                            type: "error",
                            error,
                        });
                        goto("/");
                    });
            }
        }
    });
</script>

<Header palette="primary">{$t("general.loading")}</Header>