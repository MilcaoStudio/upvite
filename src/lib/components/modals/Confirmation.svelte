<script lang="ts">
  import type { ModalProps } from "$lib/types/Modal";
  import { t } from "svelte-i18n";
  import DialogForm from "./DialogForm.svelte";
  import { translate } from "$lib/i18n";
  import TextSvelte from "$lib/i18n/TextSvelte.svelte";
  import { createElement } from "$lib/markdown/runtime/svelteRuntime";
  import { goto } from "$app/navigation";
  import { clientController } from "$lib/controllers/ClientController";

  const EVENTS = {
    close_dm: ["confirm_close_dm", "close"],
    delete_server: ["confirm_delete", "delete"],
    delete_channel: ["confirm_delete", "delete"],
    delete_bot: ["confirm_delete", "delete"],
    unfriend_user: ["unfriend_user", "remove"],
    block_user: ["block_user", "block"],
  };
  export let props: ModalProps<
    | "close_dm"
    | "delete_server"
    | "delete_channel"
    | "delete_bot"
    | "block_user"
    | "unfriend_user"
  >;
  const event = EVENTS[props.type];
  let name: string | undefined | null;
  switch (props.type) {
    case "unfriend_user":
    case "block_user":
      name = props.target.username;
      break;
    case "close_dm":
      name = props.target.recipient?.username;
      break;
    case "delete_bot":
      name = props.name;
      break;
    default:
      name = props.target.name;
  }
</script>

<DialogForm
  title={translate(`app.special.modals.prompt.${event[0]}`, {
    name: name ?? "",
  })}
  data={{}}
  schema={{}}
  callback={async () => {
    switch (props.type) {
      case "unfriend_user":
        await props.target.removeFriend();
        break;
      case "block_user":
        await props.target.blockUser();
        break;
      case "close_dm":
      case "delete_channel":
      case "delete_server":
        props.target.delete();
        if (props.type != "delete_channel") await goto("/");
        break;
      case "delete_bot":
        clientController.availableClient.bots.delete(props.target);
        props.cb?.();
        break;
    }
  }}
  submit={{
    palette: "error",
    children: $t(`app.special.modals.actions.${event[1]}`),
  }}
>
  <TextSvelte
    id="app.special.modals.prompt.{event[0]}_long"
    fields={{ name: createElement("b", null, name) }}
    slot="description"
  />
</DialogForm>
