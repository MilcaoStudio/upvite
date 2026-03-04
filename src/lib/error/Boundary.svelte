<script lang="ts">
    import { run } from 'svelte/legacy';

    import localforage from "localforage";
    import Button from "$lib/components/atoms/Button.svelte"

    interface Props {
        error?: any;
        onError?: ((err: any)=>void) | null;
        section: string;
        children?: import('svelte').Snippet;
    }

    let {
        error = null,
        onError = null,
        section,
        children
    }: Props = $props();

    run(() => {
        if ($error && onError) onError($error);
    });

    async function reset() {
        await localforage.clear();
        location.reload();
    }
</script>

{#if $error}
    <div class="CrashContainer">
        {#if section == "client"}
            <h3>Client Crash Report</h3>
            <div class="buttonDivider"></div>
            <Button on:click={() => location.reload()}>
                Refresh page
            </Button>
            <div class="buttonDivider"></div>
            <Button props={{palette: 'error'}} on:click={reset}>Reset app data</Button>
        {:else}
            <h3>Component Error</h3>
        {/if}
        <br />
        <br />
        <div>Uprising has crashed. Here's the error:</div>
        <pre>
        <code>{JSON.stringify(error)}</code>
        </pre>
        <!-- No reports? -->
        <!--<div>This error has been automatically reported.</div>-->
    </div>
{:else}
    {@render children?.()}
{/if}

<style>
div.CrashContainer {
    --error: #ed4245;
    --primary-background: #2d2d2d;

    height: 100%;
    padding: 12px;

    background: #191919;
    color: white;
}

div.CrashContainer h3 {
    margin: 0;
    margin-bottom: 12px;
}

div.CrashContainer code {
    font-size: 1.1em;
}

div.CrashContainer .buttonDivider {
    margin: 8px;
}
</style>