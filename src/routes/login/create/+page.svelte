<script lang="ts">
    import { goto } from '$app/navigation';
    import { clientController } from '$lib/controllers/ClientController';
    import { _ } from 'svelte-i18n'
    let email = '', password = '';
    function onSubmit(){
      $clientController.getAnonymousClient().register({email, password}).then(()=>{
        goto('/login');
      });
    }
</script>

<div class="container">
    <h1 class="title">{$_('login.register')}</h1>
    <form class="login-form" on:submit|preventDefault={onSubmit} >
      <div class="form-label">{$_('login.email')}</div>
      <input class="form-input" bind:value={email} type="email" placeholder={$_('login.enter.email')} required />
      <div class="form-label">{$_('login.password')}</div>
      <input class="form-input" bind:value={password} type="password" placeholder={$_('login.enter.password')} required />
      <button class="form-btn" type="submit">{$_('login.register')}</button>
    </form>
</div>