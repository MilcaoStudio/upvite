<script>
	import TitleBar from './../../TitleBar.svelte';
    import { Checkbox } from "fluent-svelte";
import RadioBase from "./RadioBase.svelte";
    import Emoji from '$lib/markdown/plugins/Emoji.svelte';

</script>



<RadioBase>
    <div class="content">
        <div class="titleContent">
            <div class="title">
                <div class="flag">
                    
                    <slot name="svg"><Emoji match="🇨🇱"></Emoji></slot>

                    
                </div>
                <div class="description">
                    <slot>Cocos</slot>

                </div>
                

            </div>
        </div>
    </div>
    <Checkbox></Checkbox>
    
    
</RadioBase>


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
</style>