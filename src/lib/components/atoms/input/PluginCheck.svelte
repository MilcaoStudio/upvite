<script lang="ts">
    import { useState } from "$lib/components/state/StateContext.svelte";
    import type { PluginInfo } from "$lib/components/state/stores/Plugins";
    import { Checkbox } from "fluent-svelte";
    import { onDestroy } from "svelte";

    const plugins = useState().plugins;
    interface Props {
        plugin: PluginInfo;
    }

    let { plugin }: Props = $props();
    let checked = $derived(plugin.enabled);
    function onChange() {
        console.log(plugin.id);
        // checked value updates slower than onChange
        // then if the check WAS off, it IS actually on
        if (!checked) {
            plugins.load(plugin.namespace, plugin.id);
        } else {
            plugins.unload(plugin.namespace, plugin.id);
        }
    }
    let source = $derived(plugins.get(`${plugin.namespace}/${plugin.id}`)?.entrypoint);
    let url = $state<string>();
    $effect(()=>{
        if (source) {
            url = URL.createObjectURL(new Blob([source], {type: "text/plain"}));
        }
        return ()=>{
            if (url) {
                URL.revokeObjectURL(url);
            }
        }
    })
</script>

<Checkbox bind:checked on:change={onChange}>{plugin.namespace}/{plugin.id} {plugin.version}</Checkbox>
<a href={url} target="_blank"><button>View entrypoint</button></a>
<button onclick={()=>plugins.remove(plugin.namespace, plugin.id)}>Remove</button>