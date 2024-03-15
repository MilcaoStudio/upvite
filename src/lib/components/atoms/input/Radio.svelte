
<script>
    export let language= "Alemán";
</script>
<!-- svelte-ignore missing-declaration -->
<button>
    <div class="flex-button">




        <div class="options"></div>
        <div class="language">
            <h3>{language}</h3>
        </div>
    </div>
</button>




<style>

    button{
        background-color: rgba(var(--background-rgb), max(0.2, 0.7));
        border-radius: var(--border-radius-inner);
        width:100%;
        height: 32px;
        padding: 10px;
        border:none;

    }


</style>