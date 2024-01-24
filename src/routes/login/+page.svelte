<script>
    import { clientController } from '$lib/controllers/ClientController';

  let email = '';
  let password = '';

  import { _ } from 'svelte-i18n'

  function handleLogin(){
    console.log(email);
    console.log(password);
    clientController.login({email, password}).then(()=>{
      console.log(clientController.getActiveSession());
    })
  }
</script>

<div class="container">
  <h1 class="title">{$_('login.title')}</h1>
  <form class="login-form" on:submit={handleLogin}>
    <div class="form-label">{$_('login.email')}</div>
    <input name="email" class="form-input" type="email" bind:value={email} placeholder={$_('login.enter.email')} required />
    <div class="form-label">{$_('login.password')}</div>
    <input name="password" class="form-input" type="password" bind:value={password} placeholder={$_('login.enter.password')} required />
    <button class="form-btn" type="submit">Iniciar Sesión</button>
  </form>
</div>