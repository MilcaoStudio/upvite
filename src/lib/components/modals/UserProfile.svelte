
<script lang="ts">
	import Item from '../settings/common/buttonSimple.svelte';


    import ButtonItem from "../navigation/items/ButtonItem.svelte";
import UserIcon from "../user/UserIcon.svelte";
    import ButtonSimple from '../settings/common/buttonSimple.svelte';
    import IconButton from '../atoms/input/IconButton.svelte';

    import { goto } from '$app/navigation';
    import type { Client } from "revolt.js";
    export let props;
    console.log(props)


 


    
</script>




<div class="base ">
    <div class="container">
        <div class="userProfile">
    
            <div class="userHeader">
                <div class="profile">
                    
                    <UserIcon  size={80}></UserIcon>
            
                    <IconButton on:onClick={() => {goto("/")}}><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M16 19h6" /><path d="M19 16v6" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4" /></svg></IconButton>


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
        /*position: absolute*/;
        max-height: 100%;
        user-select: none;
        display: grid;
        overflow-y: auto;
        place-items: center;
        color: var(--foreground);
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
        -webkit-animation: svelte-1qibxfp-menu-open var(--fds-control-normal-duration) var(--fds-control-fast-out-slow-in-easing),svelte-1qibxfp-menu-shadow var(--fds-control-fast-duration) var(--fds-control-fast-out-slow-in-easing) var(--fds-control-normal-duration) forwards;
        animation: svelte-1qibxfp-menu-open var(--fds-control-normal-duration) var(--fds-control-fast-out-slow-in-easing), svelte-1qibxfp-menu-shadow var(--fds-control-fast-duration) var(--fds-control-fast-out-slow-in-easing) var(--fds-control-normal-duration) forwards;
    }
    .container{
        min-height: 200px;
        max-width: min(100% - 50px, 560px);
        max-height: min(-20px + 100vh, 650px);
        margin: 20px;
        position: relative;
        display: flex;
        flex-direction: column;
        border-radius: var(--border-radius-inner);
        width: 100%;
        background-color: var(--tertiary-background);
        -webkit-backdrop-filter: blur(8px) !important;
        backdrop-filter: blur(8px) !important;
        z-index: 20 !important;
        background-color: rgba( var(--tertiary-background-rgb), max(0, 0.7) ) !important;

    }
    .userProfile{
        -webkit-box-flex: 1;
        flex-grow: 1;
        padding: 1rem 1rem 1rem;
        overflow-y: auto;
        font-size: 0.9375rem;
        display: flex;
        background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url(https://autumn.revolt.chat/backgrounds/CWC9N0fKPMBJIRsuZavJinttNKtT1PLdCV0Pxy3iv0?width=1000);
        flex-direction: column;
        background-size: cover;
        background-position: center;
    }
    .profile{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

</style>