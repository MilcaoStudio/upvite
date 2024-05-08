<script>
    import LoginForm from "$lib/components/form/LoginForm.svelte";
    import { useApi } from "$lib/controllers/ClientController";

    const api = useApi();
</script>

<LoginForm type="resend"
    callback={async (data) => {
        await api.post("/auth/account/reverify", data);
    }}
/>