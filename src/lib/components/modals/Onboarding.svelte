<script lang="ts">
    import { takeError } from "$lib";
    import type { ModalProps } from "$lib/types/Modal";
    import { _ } from "svelte-i18n";
    import DialogForm from "./DialogForm.svelte";
    import { createTextSnippet } from "$lib/i18n/TextSvelte.svelte";

    // export let props: ModalProps<"onboarding"> = $props();
  interface Props {
    props: ModalProps<"onboarding">;
  }

  let { props }: Props = $props();
    let loading = $state(false)
    let error = $state<string>()
    $inspect(error);
</script>

<DialogForm
  nonDismissable
  {...props}
  callback={async ({username})=>{
    loading = true;
    props.callback(''+username, true).then(()=>{
      console.log('Onboarding completed!')
      props.onClose()
    }).catch(_e=>{
            error = takeError(_e);
            loading = false;
        });
  }}
  title="Welcome to Uprising!"
  schema={{username: "text"}}
  data={{username: {field: 'User name'}}}
  submit={{children: createTextSnippet(()=>"Looks good")}} closable=false>
{#snippet description()}
    <p >
    It's time to choose a username.
    <br>
    Others will be able to find, recognise and mention you with this name, so choose wisely.
    <br>
    You can change it at any time in your User Settings.
  </p>
  {/snippet}
</DialogForm>