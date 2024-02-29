<script lang="ts">
    import CheckAuth from '$lib/controllers/CheckAuth.svelte';
    import '../../styles/login.css'
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
