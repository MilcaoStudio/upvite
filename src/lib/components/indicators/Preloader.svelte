<script lang="ts">
    import { ProgressRing } from "fluent-svelte";
    export let type: 'ring' | 'spinner';
</script>

<style>

    @keyframes skSpinner {
        0%, 80%, 100% {
            -webkit-transform: scale(0);
            transform: scale(0);
        }
        
        40% {
            -webkit-transform: scale(1.0);
            transform: scale(1.0);
        }
    }

    .preloader {
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        
    }

    .spinner {
        height:100%;
        display: flex;
        text-align: center;
        justify-content: space-between;
        align-items: center;
        justify-content: center;
    }

    .spinner > div {
        width: 16px;
        height: 16px;
        background-color: var(--tertiary-foreground);
        border-radius: 100%;
        display: inline-block;
        animation: skSpinner 1.4s infinite ease-in-out both;
    }
    
    .spinner div:nth-child(1) {
        animation-delay: -0.32s;
    }
    
    .spinner div:nth-child(2) {
        animation-delay: -0.16s;
    }
</style>


<div class="preloader">
    {#if type == 'ring'}
        <ProgressRing class="ring" size={48} />
    {:else}
        <div class="spinner">
            <div />
            <div />
            <div />
        </div>
    {/if}
</div>