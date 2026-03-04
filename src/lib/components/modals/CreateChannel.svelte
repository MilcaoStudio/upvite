<script lang="ts">
  import type { ModalProps } from "$lib/types/Modal";
  import { t } from "svelte-i18n";
  import DialogForm from "./DialogForm.svelte";
  import { goto } from "$app/navigation";
  import type { FormTemplate, MapFormToValues } from "$lib/types/Form";

  export let props: ModalProps<"create_channel">;
  async function callback(values: MapFormToValues<FormTemplate>) {
    const channel = await props.target.createChannel({
      type: values.type as "Text" | "Voice",
      name: "" + values.name,
      description: "" + values.description,
    });

    if (props.cb) {
      props.cb(channel);
    } else {
      goto(`/server/${props.target.id}/channel/${channel.id}`);
    }
  }
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
    children: $t("app.special.modals.actions.create"),
  }}
/>
