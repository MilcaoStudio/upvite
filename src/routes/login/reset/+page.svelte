<script>
    import LoginForm from "$lib/components/form/LoginForm.svelte";
    import { useApi, useClient } from "$lib/controllers/ClientController";
    const client = useClient();
</script>

<LoginForm type="send_reset"
    callback={async ({email, captcha}) => {
        await client.account.resetPassword(email, captcha);
    }}
/>