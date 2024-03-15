
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

    label{
        
        height: 32px;
        padding: 10px;
        border:none;
        display: flex;
        height: 45px;
        padding: 0 8px;
        background-color: rgba(var(--background-rgb), max(0.2, 0.7));
        border-radius: var(--border-radius);
        margin-top: 0;
        transition: .1s ease background-color;


        cursor: pointer;
        user-select: none;
        -webkit-box-align: center;
        align-items: center;
        border-radius: var(--border-radius-small);
        transition: background-color 0.1s ease 0s;

    }

    .flex-button{
        display: flex;
        justify-content: space-between;
        flex-grow: 1;
        gap: 10px;
        padding: 4px;
    }

    


</style>