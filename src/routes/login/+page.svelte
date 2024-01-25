<script lang="ts">
  import { clientController } from '$lib/controllers/ClientController';
  import { _ } from 'svelte-i18n';
  let loading = false;
  let success: string | null = null;
  let credentials = {
    email: '',
    password: ''
  };

  function onSubmit(){
    loading = true;
    clientController.login(credentials).then(()=>{
      success = credentials.email;
      console.log(clientController.getActiveSession());
    })
  }
</script>

{#if success}
  <div></div>
{/if}

<div class="container">
  <h1 class="title">{$_('login.title')}</h1>
  <form class="login-form" on:submit|preventDefault={onSubmit}>
    <div class="form-label">{$_('login.email')}</div>
    <input name="email" class="form-input" type="email" bind:value={credentials.email} placeholder={$_('login.enter.email')} required />
    <div class="form-label">{$_('login.password')}</div>
    <input name="password" class="form-input" type="password" bind:value={credentials.password} placeholder={$_('login.enter.password')} required />
    <button class="form-btn" type="submit">{$_('login.title')}</button>
  </form>
</div>