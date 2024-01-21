<script>
  let email = '';
  let password = '';

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
        // Puedes redirigir a otra página o realizar acciones adicionales aquí
      } else {
        console.error('Error en el inicio de sesión');
        // Puedes manejar errores específicos aquí
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };
</script>

<main>
  <div class="container">
    <h1 class="title">Iniciar Sesión</h1>
    <form class="login-form" on:submit|preventDefault={handleLogin}>
      <label>
        Correo:
        <input type="email" bind:value={email} required />
      </label>
      <label>
        Contraseña:
        <input type="password" bind:value={password} required />
      </label>
      <button class="login-btn" type="submit">Iniciar Sesión</button>
    </form>
  </div>
</main>