<script>
    import { useClient } from "$lib/components/client/ClientContext.svelte";
    import LoginForm from "$lib/components/form/LoginForm.svelte";
    const client = useClient();
</script>

<LoginForm type="send_reset"
    callback={async ({email, captcha}) => {
        await client.account.resetPassword(email, captcha);
    }}
/>