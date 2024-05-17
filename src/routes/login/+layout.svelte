<script lang="ts">
    import CheckAuth from '$lib/controllers/CheckAuth.svelte';
    import { setContext } from 'svelte';
    import '../../styles/login.css';
    import { page } from '$app/stores';
    setContext("invite", $page.url.searchParams.get("invite"));
</script>

<CheckAuth>
    <main class="login">
        <div class="content">
            <div class="form">
                <slot />
            </div>
            <div class="bottom">
                <div class="links">
                    <!--TODO: links-->
                </div>
            </div>
        </div>
    </main>    
</CheckAuth>
