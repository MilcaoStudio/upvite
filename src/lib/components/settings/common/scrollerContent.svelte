<div class="scroller-y">
    <div class="container">
        <slot/>
    </div>
</div>

    


<style>

    .container{
        min-width: 218px;
        width:100%;
        padding: 30px 8px;
        display: flex;
        gap: 2px;
        flex-direction: column;

    }

    .scroller-y{

        overflow-y: auto;
        transition: visibility .1s;
        overflow-x: auto;
        padding: 0px 16px;
        background-color: var(--secondary-background);
        height: 100vh;
        direction: ltr /*ltr rtl*/;
        flex: 1 1 950px;
        margin-right: 64px;
        

    }

</style>

