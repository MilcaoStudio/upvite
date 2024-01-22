<script lang="ts">
    import '../styles/app.css'
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import { Client } from 'revolt.js'
    import { PUBLIC_API_URL } from '$env/static/public';
    const client = writable(new Client({apiURL: PUBLIC_API_URL}))
    setContext('client', client)
</script>

<slot />