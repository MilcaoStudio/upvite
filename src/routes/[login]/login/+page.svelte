<script>
  let email = '';
  let password = '';

  import { _ } from 'svelte-i18n'
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        console.log('Inicio de sesión exitoso');
      } else {
        console.error('Error en el inicio de sesión');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };
</script>

<div class="container">
  <h1 class="title">{$_('login.title')}</h1>
  <form class="login-form" on:submit|preventDefault={handleLogin}>
    <div class="form-label">{$_('login.email')}</div>
    <input class="form-input" type="email" bind:value={email} placeholder={$_('login.enter.email')} required />
    <div class="form-label">{$_('login.password')}</div>
    <input class="form-input" type="password" bind:value={password} placeholder={$_('login.enter.password')} required />
    <button class="form-btn" type="submit">Iniciar Sesión</button>
  </form>
</div>