<script>
    import UprisingApp from "$lib/components/UprisingApp.svelte";
    import Item from "$lib/components/settings/common/item.svelte";
    import Scroller from "$lib/components/settings/common/scroller.svelte";

export let data;


    /**
     * @type {typeof import("$lib/components/settings/personal/appearance.svelte").default}
     */
let component;

let href = "/settings/"

$: setting = data.setting;

$: {
    switch (setting) {
        case 'support':
        case 'appearance':
            import('$lib/components/settings/personal/appearance.svelte').then(module => {
                component = module.default;
            });
            break;
        default:
            import('$lib/components/settings/personal/profile.svelte').then(module => {
                component = module.default;
            });
    }
}
</script>


<UprisingApp>

    <div class="flex-column">
        <Scroller>
            <h1>{setting}</h1>

        <Item href="{href}appearance"><h>Appearance</h> </Item>
    
        
        <a href="{href}appereance">
            <h2>profile</h2>
        </a>
        <a href="{href}support">
            <h2>profile</h2>
        </a>
        <a href="{href}appereance">
            <h2>profile</h2>
        </a>
        <a href="{href}support">
            <h2>profile</h2>
        </a>
        <a href="{href}appereance">
            <h2>profile</h2>
        </a>
        <a href="{href}support">
            <h2>profile</h2>
        </a>
        <a href="{href}appereance">
            <h2>profile</h2>
        </a>
        <a href="{href}support">
            <h2>profile</h2>
        </a>
        <a href="{href}appereance">
            <h2>profile</h2>
        </a>
        <a href="{href}support">
            <h2>profile</h2>
        </a>
        <a href="{href}support">
            <h2>profile</h2>
        </a>
        <a href="{href}appereance">
            <h2>profile</h2>
        </a>
        <a href="{href}support">
            <h2>profile</h2>
        </a>
        <a href="{href}support">
            <h2>profile</h2>
        </a>
        <a href="{href}appereance">
            <h2>profile</h2>
        </a>
        <a href="{href}support">
            <h2>profile</h2>
        </a>
    
        </Scroller>
        
        <Scroller>
            <svelte:component this={component} />
        </Scroller>
    
        

    </div>

    
    
</UprisingApp>

<style>
    .flex-column{
        display: flex;
        flex-direction: row;
        
    }

    a, a:link, a:visited, h2, p, h3{
        color:var(--tertiary-foreground);
    }

    a:hover, h2:hover, h3, p:hover{
        color: var(--primary-foreground);
    }
</style>

