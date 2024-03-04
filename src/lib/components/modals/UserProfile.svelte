<script>

</script>


<div class="container">
    <div class="userProfile">

        <div class="userHeader">

        </div>
        <div class="userContent">
            
        </div>

    </div>
</div>


<style>
    

    .container{
        min-height: 200px;
        max-width: min(-20px + 100vw, 560px);
        max-height: min(-20px + 100vh, 650px);
        margin: 20px;
        display: flex;
        flex-direction: column;
    
        border-radius: var(--border-radius-inner);
        width: 500px;
        height: 420px;
        background-color: var(--tertiary-background);
    }
    .userProfile{
        -webkit-box-flex: 1;
        flex-grow: 1;
        padding: 0px 1rem 1rem;
        overflow-y: auto;
        font-size: 0.9375rem;
        display: flex;
        flex-direction: column;
    }

</style>