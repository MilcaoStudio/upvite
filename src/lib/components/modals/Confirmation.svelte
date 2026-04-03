<script lang="ts">
  import type { ModalProps } from "$lib/types/Modal";
  import { t } from "svelte-i18n";
  import DialogForm from "./DialogForm.svelte";
  import { translate } from "$lib/i18n";
  import TextSvelte, { createTextSnippet } from "$lib/i18n/TextSvelte.svelte";
  import { createElement } from "$lib/markdown/runtime/svelteRuntime";
  import { goto } from "$app/navigation";
    import { useClient } from "../client/ClientContext.svelte";

  const EVENTS = {
    close_dm: ["confirm_close_dm", "close"],
    delete_server: ["confirm_delete", "delete"],
    delete_channel: ["confirm_delete", "delete"],
    delete_bot: ["confirm_delete", "delete"],
    unfriend_user: ["unfriend_user", "remove"],
    block_user: ["block_user", "block"],
  };
  interface Props {
    props: ModalProps<
    | "close_dm"
    | "delete_server"
    | "delete_channel"
    | "delete_bot"
    | "block_user"
    | "unfriend_user"
  >;
  }

  const client = useClient();
  let { props }: Props = $props();
  const event = $derived(EVENTS[props.type]);
  let name = $derived.by(()=>{
    switch (props.type) {
      case "unfriend_user":
      case "block_user":
        return props.target.username;
      case "close_dm":
        return props.target.recipient?.username;
      case "delete_bot":
        return props.name;
      default:
        return props.target.name;
    }
  });

  const submitSnippet = createTextSnippet(()=>$t(`app.special.modals.actions.${event[1]}`))
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
        client.bots.delete(props.target);
        props.cb?.();
        break;
    }
  }}
  submit={{
    palette: "error",
    children: submitSnippet,
  }}
>
  {#snippet description()}
    {#snippet boldName()}<b>{name}</b>{/snippet}
    <TextSvelte
      id="app.special.modals.prompt.{event[0]}_long"
      fields={{ name: boldName}}
    />
  {/snippet}
</DialogForm>
