<script lang="ts">
    import CheckAuth from '$lib/controllers/CheckAuth.svelte';
    import { setContext } from 'svelte';
    import '../../styles/login.css';
    import { page } from '$app/state';
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
    setContext("invite", page.url.searchParams.get("invite"));
</script>

<CheckAuth>
    <main class="login">
        <div class="content">
            <div class="form">
                {@render children?.()}
            </div>
            <div class="bottom">
                <div class="links">
                    <!--TODO: links-->
                </div>
            </div>
        </div>
    </main>    
</CheckAuth>
