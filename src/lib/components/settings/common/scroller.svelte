<div class="scroller-y">
    <div class="container">
        <slot/>
    </div>
</div>

    


<style>

    .container{
        width: 218px;
        padding: 70px 8px;
        display: flex;
        gap: 2px;
        flex-direction: column;

    }

    .scroller-y{

        overflow-y: auto;
        transition: visibility .1s;
        max-height: 100vh; /* Ajusta según sea necesario */
        overflow-x: hidden;
        flex: 1 0 218px;
        direction: ltr;  /*ltr  rtl*/
        display: flex;
        justify-content: flex-end;
        
    }

</style>

