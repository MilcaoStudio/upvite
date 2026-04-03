<script lang="ts">
  import type { ModalProps } from "$lib/types/Modal";
  import { t } from "svelte-i18n";
  import DialogForm from "./DialogForm.svelte";
  import { goto } from "$app/navigation";
  import type { FormTemplate, MapFormToValues } from "$lib/types/Form";
    import { createTextSnippet } from "$lib/i18n/TextSvelte.svelte";

  interface Props {
    props: ModalProps<"create_channel">;
  }

  interface CreateChannelForm {
    type: "Text" | "Voice",
    name: string,
    description: string,
  }

  let { props }: Props = $props();
  async function callback(values: CreateChannelForm) {
    const channel = await props.target.createChannel({
      type: values.type as "Text" | "Voice",
      name: values.name,
      description: values.description,
    });

    if (props.cb) {
      props.cb(channel);
    } else {
      goto(`/server/${props.target.id}/channel/${channel.id}`);
    }
  }

  const createSnippet = createTextSnippet(()=>$t("app.special.modals.actions.create"));
</script>

<DialogForm
  title={$t("app.context_menu.create_channel")}
  schema={{
    name: "text",
    description: "text",
    type: "radio",
  }}
  data={{
    name: { field: $t("app.main.servers.channel_name") },
    description: { field: $t("app.main.servers.channel_description")},
    type: {
      field: $t("app.main.servers.channel_type"),
      options: [
        { name: $t("app.main.servers.text_channel"), value: "Text" },
        { name: $t("app.main.servers.voice_channel"), value: "Voice" },
      ],
    },
  }}
  defaults={{ type: "Text" }}
  {callback}
  submit={{
    children: createSnippet,
  }}
/>
