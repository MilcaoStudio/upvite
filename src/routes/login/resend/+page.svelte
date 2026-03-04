<script>
    import LoginForm from "$lib/components/form/LoginForm.svelte";
    import { useApi, useClient } from "$lib/controllers/ClientController";

    const api = useApi();
    const client = useClient();
</script>

<LoginForm type="resend"
    callback={async ({email, captcha}) => {
        await client.account.reverify(email, captcha);
    }}
/>