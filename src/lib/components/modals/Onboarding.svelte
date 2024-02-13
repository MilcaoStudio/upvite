<script lang="ts">
    import { takeError } from "$lib";
    import Button from "../atoms/Button.svelte";
    import Preloader from "../indicators/Preloader.svelte";

    export let callback: (
              username: string,
              loginAfterSuccess?: true,
          ) => Promise<void>
    export let onClose: ()=>void
    let username: string
    let loading = false
    let error: string

    function onSubmit() {
        loading = true
        callback(username, true).then(()=>onClose()).catch(_e=>{
            error = takeError(_e);
            loading = false;
        });
    }
</script>

<style>
  .onboarding {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .onboarding div.container {
    display: flex;
    max-width: 750px;
    flex-grow: 1;
    align-items: left;
  }

  .onboarding div.header {
    gap: 8px;
    padding-top: 5em;
    display: flex;
  }

  .onboarding input {
    width: 100%;
  }

</style>

<div class="onboarding">
  <div class="container">
    <div class="header">
      <h1>Welcome to UpRising.</h1>
    </div>
    <div class="form">
        {#if loading}
          <Preloader type='spinner' />
        {:else}
          <p>It's time to choose a username.
            <br>
            Others will be able to find, recognise and mention you with this name, so choose wisely.
            <br>
            You can change it at any time in your User Settings.
          </p>
          <form on:submit|preventDefault={onSubmit}>
            <div>
              <input bind:value={username} type="text" placeholder="Username">
            </div>
            <p>
              You will be automatically assigned a number tag which you can find from settings.
            </p>
            <Button props={{palette:'primary'}}>Looks good</Button>
          </form>
        {/if}
    </div>
  </div>
</div>