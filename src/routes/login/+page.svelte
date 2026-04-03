<script lang="ts">
    import { useClientController } from '$lib/components/client/ClientContext.svelte';
  import LoginForm from '$lib/components/form/LoginForm.svelte';
  import { _ } from 'svelte-i18n';
</script>

<LoginForm type="login" callback={useClientController().login}>
  <span class="create">
    {$_('login.new') + ' '}
    <a href="/login/create">
      {$_('login.create')}
    </a>
</span>
<span class="create">
    {$_('login.forgot') + ' '}
    <a href="/login/reset">
        {$_('login.reset')}
    </a>
</span>
<span class="create">
    {$_('login.missing_verification') + ' '}
    <a href="/login/resend">
        {$_('login.resend')}
    </a>
</span>
</LoginForm>