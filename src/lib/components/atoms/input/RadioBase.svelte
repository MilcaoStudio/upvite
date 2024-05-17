
<script>

</script>
<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-label-has-associated-control -->
<label>
    <div class="flex-button">
        <slot/>
    </div>
</label>




<style>

    .content{
        flex-direction: column;
        display: flex;
        -webkit-box-flex: 1;
        flex-grow: 1;
        gap: 3px;
    }
    .content >div div{
        gap: 8px;
    display: flex;
    align-items: center;
    flex-direction: row;
    }
    .title{
        font-size: 0.9375rem;
        font-weight: 600;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    } 

    .flex-button{
        display: flex;
        justify-content: space-between;
        flex-grow: 1;
        gap: 10px;
        padding: 4px;
    }

    


</style>