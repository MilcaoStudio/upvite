<script>
    import LoginForm from "$lib/components/form/LoginForm.svelte";
    import { useApi } from "$lib/controllers/ClientController";
    const api = useApi();
</script>

<LoginForm type="send_reset"
    callback={async (data) => {
        await api.post("/auth/account/reset_password", data);
    }}
/>