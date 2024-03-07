
<script lang="ts">

import CategoryButton from "../form/CategoryButton.svelte";
import UserIcon from "../user/UserIcon.svelte";


let icon = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-flag-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 14h14v-9h-14v16" /></svg>`;

    
</script>

<CategoryButton {icon}></CategoryButton>

<div class="base">
    <div class="container">
        <div class="userProfile">
    
            <div class="userHeader">
                <div class="profile">
                    
                    <UserIcon size={80}></UserIcon>
                </div>
                <div class="medals"></div>
                <div class="tabs">
    
                </div>
    
            </div>
            <div class="userContent">
                <div class="">
                    <div class="category"></div>
                    <div class="content"></div>
                </div>
                
            </div>
    
        </div>
    </div>

</div>





<style>
    
    .base{
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        z-index: 9999;
        position: fixed;
        max-height: 100%;
        user-select: none;
        display: grid;
        overflow-y: auto;
        place-items: center;
        color: var(--foreground);
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
    }
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