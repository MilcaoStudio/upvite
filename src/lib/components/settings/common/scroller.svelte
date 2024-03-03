<div class="scroller-y">
    <div class="container">
        <slot/>
    </div>
</div>

    


<style>

    .container{
        min-width: 218px;
        padding: 80px 8px;
        display: flex;
        gap: 2px;
        flex-direction: column;

    }

    .scroller-y{

        overflow-y: scroll;
        transition: visibility .1s;

    }

</style>

