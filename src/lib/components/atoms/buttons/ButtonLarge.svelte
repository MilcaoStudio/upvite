<div class="base">
    <div class="iconContainer">

        <slot name="svg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-at">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28" />
              </svg>
        </slot>

    </div>
    <div class="content">
        <h2 class="title">
            aaaaaaaaa
        </h2>
        <div class="text">
            <p>holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
        </div>
    </div>
    <div class="click">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-select">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
            <path d="M9 11l3 3l3 -3" />
          </svg>
    </div>
</div>


<style>
    .iconContainer{
        padding: 6px;
        border-radius: var(--border-radius-small);
        background: var(--secondary-header);
        display: flex;
    }
    h2, p{
        padding: 0px;
        margin: 0px;
    }
    .base{
        display: flex;
        gap: 12px;
        flex: 1 1 auto;
        flex-grow: 1;
        height: 72px;
        background: rgba(24, 25, 35, max(0.5 , 0.7));
        border-radius: var(--border-radius);
        align-items: center;
        padding: 0px 12px 0px 12px;
        
    }
    .content{
        flex-direction: column;
        display: flex;
        -webkit-box-flex: 1;
        flex-grow: 1;
        gap: 6px;
    }

    .base >div div{
        gap: 8px;
    display: flex;
    align-items: center;
    flex-direction: row;
    }
    .title{
        font-size: 1.24356rem;
        font-weight: 600;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    .text{
        font-size: 0.9375rem;
        font-weight: 400;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
</style>