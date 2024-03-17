<script>
    export let href= "";
    export let active = false;
</script>

<a class="flex" href="{href}" class:active>
    <slot name="svg"> <!-- Utiliza una ranura (slot) para el SVG -->
        <!-- Tu SVG predeterminado aquí -->
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" stroke-width="0" fill="currentColor" /><path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" stroke-width="0" fill="currentColor" /></svg>
    </slot>

    <p><slot/></p>
</a>

<style>
    .flex{
        display: flex;
        flex-direction: row;
        align-items: center;
        transition: all 0.15s ease-in-out;
        gap: 6px;
        padding: 7px;
        border-radius: var(--border-radius);
        color: var(--secondary-foreground);
        
    }
    /* Estilo de hover cuando el Item está activo */
    .active{
        background-color: var(--secondary-background) !important;
        color: var(--foreground) !important;  /* Cambia el color del texto */
        filter: none !important;
    }

    .flex:hover{
        background-color: var(--secondary-background);
        filter: grayscale(0.2) brightness(0.75);

    }

    .flex:hover p{
        color: var(--foreground);
    }

    p{
        margin: 0px;
        display: flex;
        align-items: center;
    }

</style>