<script lang="ts">
    import { takeError } from "$lib";
    import type { ModalProps } from "$lib/types/Modal";
    import { _ } from "svelte-i18n";
    import ModalForm from "./ModalForm.svelte";

    // export let props: ModalProps<"onboarding"> = $props();
    export let props: ModalProps<"onboarding">
    let loading = false
    let error: string
    $: console.error(error);
</script>

<ModalForm
  props={props}
  callback={async ({username})=>{
    loading = true;
    console.log('Calling callback...');
    props.callback(''+username, true).then(()=>{
      console.log('Onboarding completed!')
      props.onClose()
    }).catch(_e=>{
            error = takeError(_e);
            loading = false;
        });
  }}
  schema={{username: "text"}}
  data={{username: {field: 'User name'}}}
  submit={{children: 'Looks good!'}}>
<svelte:fragment slot="title">Welcome to Uprising!</svelte:fragment>
<p slot="description">
  It's time to choose a username.
  <br>
  Others will be able to find, recognise and mention you with this name, so choose wisely.
  <br>
  You can change it at any time in your User Settings.
</p>
</ModalForm>