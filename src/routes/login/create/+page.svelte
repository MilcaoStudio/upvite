<script lang="ts">
    import { _ } from 'svelte-i18n'
</script>

<div class="container">
    <h1 class="title">{$_('login.register')}</h1>
    <form class="login-form" >
      <div class="form-label">{$_('login.email')}</div>
      <input class="form-input" name="email" type="email"  placeholder={$_('login.enter.email')} required />
      <div class="form-label">{$_('login.password')}</div>
      <input class="form-input" name="password" type="password" placeholder={$_('login.enter.password')} required />
      <button class="form-btn" type="submit">{$_('login.register')}</button>
    </form>
</div>