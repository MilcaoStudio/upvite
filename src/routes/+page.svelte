<script>
    import { page } from "$app/stores";
    import { state } from "$lib/State";
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import Home from "$lib/components/home/Home.svelte";
    import CheckAuth from "$lib/controllers/CheckAuth.svelte";

    $: state.layout.setLastHomePath($page.url.pathname);
</script>

<CheckAuth auth>
    <UprisingApp>
        <Home />
    </UprisingApp>
</CheckAuth>